import Plugin from './Plugin';
import * as dbNames from 'Storage/DBNames';
import {Creators} from 'Redux/requests/actions';
import {findRequestById, getCurrentTipForRequest} from 'Chain/utils';
import {
  normalizeRequest,
  normalizeChallenge
} from './utils';
import {default as topOps} from 'Redux/analytics/topRequest/operations';

/**
 * Handles request data and tipping activity
 */
export default class RequestDataHandler extends Plugin {
  constructor(props) {
    super({
      ...props,
      id: "RequestDataHandler",
      fnContexts: ['requestData', 'addTip']
    });
    [
      'process',
      'handleRequestData',
      'handleTip'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }


  process(txn, store) {
    return async (dispatch,getState)=>{
      //if context is request data, handle that differently
      if(txn.fn === 'requestData') {
        return dispatch(this.handleRequestData(txn, store));
      }

      //otherwise, handle as a tip
      return dispatch(this.handleTip(txn, store));
    }
  }


  handleRequestData(txn, store) {
    return async (dispatch,getState) => {

      //there is a case where a request data becomes a tip event if
      //something requests data for an existing request. So we need
      //to handle that case here.
      if(txn.logEventMap[dbNames.TipAdded]) {
        return dispatch(this.handleTip(txn, store));
      }

      //check for required basic events
      let req = txn.logEventMap[dbNames.DataRequested];
      let newChallenge = txn.logEventMap[dbNames.NewChallenge];
      if(!req && !newChallenge) {
        return;
      }

      let state = getState();
      let byId = state.requests.byId;

      if(req) {
        //cache event locally for future recovery
        store({
          database: dbNames.DataRequested,
          key: ""+req.id,
          data: req.toJSON()
        });
        //add dashboard specific fields to request
        req = normalizeRequest(req);
      }

      if(!req) {
        //if we don't have a request, just a challenge, find the matching request.
        req = byId[newChallenge.id];
        if(!req) {
          req = await dispatch(findRequestById(newChallenge.id));

          if(!req) {
            console.log("Could not find request for new challenge", newChallenge);
            //something's wrong
            return;
          }
          //since we read from chain manually, we need to store it locally
          store({database: dbNames.DataRequested,
            key: ""+req.id,
            data: req.toJSON()
          });
          req = normalizeRequest(req);
        }
      }

      if(newChallenge) {
        //normalize any new challenge to include dashboard fields
        newChallenge = normalizeChallenge(req, newChallenge);

        //cache it for recovery later
        store({
          database: dbNames.NewChallenge,
          key: newChallenge.challengeHash,
          data:newChallenge.toJSON()
        });

        //store the challenge in the request by its hash
        req.challenges = {
          ...req.challenges,
          [newChallenge.challengeHash]: newChallenge
        };

        //update analytics will new challenge
        dispatch(topOps.challengeIssued(newChallenge));
      }

      //update redux with new request or existing request with its added challenge
      dispatch(Creators.addRequest({request: req}));
      if(newChallenge) {
        //update current challenge if new challenge was issued
        dispatch(Creators.updateCurrent({challenge: req.challenges[newChallenge.challengeHash]}))
      }
    }
  }

  handleTip(txn, store) {
    return async (dispatch, getState) => {

      //make sure we have tip and maybe a new challenge event
      let tipEvts = txn.logEventMap[dbNames.TipAdded];
      let ch = txn.logEventMap[dbNames.NewChallenge];
      if(!tipEvts) {
        return;
      }

      //in case there are multiple tip events in the txn. Not sure how that can
      //happen but just in case
      if(!Array.isArray(tipEvts)) {
        let a = [tipEvts];
        tipEvts = a;
      }
      if(tipEvts.length === 0) {
        return;
      }

      //increment tip amount of request
      for(let i=0;i<tipEvts.length;++i) {
        let tipEvt = tipEvts[i];
        //get request from redux store
        let req = getState().requests.byId[tipEvt.id];
        if(!req) {
          //or lookup if we don't know about it yet
          req = await dispatch(findRequestById(tipEvt.id));
          if(!req) {
            console.log("Could not find request for incoming tip with id: " + tipEvt.id);
            return;
          }
          //store locally for future recovery
          store({
            database: dbNames.DataRequested,
            key: ""+req.id,
            data: req.toJSON()
          });
          //normalize with fields used by dashboard
          req = normalizeRequest(req);
        }

        let tip = tipEvt.totalTips;
        if(!txn.__recovering) {
          //we go back on chain to get the actual current tip because the
          //total tips has been wrong in early versions. If this gets slow
          //let's check the total tips again or fix it on contract.
          tip = await dispatch(getCurrentTipForRequest(req.id));
          if(!tip) {
            tip  = 0;
          }
        }

        //remember the tip event for future recovery
        store({
            database: dbNames.TipAdded,
            key: tipEvt.transactionHash,
            data: tipEvt.toJSON()
        });

        //include the tip in the request's tip set
        let tips = req.tips || [];
        tips = [
          ...tips,
          tipEvt
        ];

        //only keep last 50 tips. Note that we shift from the
        //front of the list to keep latest tips
        while(tips.length > 50) {
          tips.shift();
        }
        req = {
          ...req,
          currentTip: tip,
          tips
        };
        //update redux store with changed request
        dispatch(Creators.updateRequest({request: req}));
      }//end tip event loop

      if(ch) {
        //we have a new challenge as well

        //get associated request
        let req = getState().requests.byId[ch.id];
        if(!req) {
          //or find on-chain
          req = await dispatch(findRequestById(ch.id));
          if(req) {
            //store locally for future recovery
            store({database: dbNames.DataRequested,
              key: req.id,
              data: req.toJSON()
            });
            //and normalize for dashboard use
            req = normalizeRequest(req);
          } else {
            //no request found bail out
            return;
          }
        }

        //add dashboard specific fields
        ch = normalizeChallenge(req, ch);

        //and remember the challenge for future recovery
        store({
          database: dbNames.NewChallenge,
          key: ch.challengeHash,
          data: ch.toJSON()
        });

        //update request with new challenge
        req = {
          ...req,
          challenges: {
            ...req.challenges,
            [ch.challengeHash]: ch
          }
        }
        //update the redux store with new request
        dispatch(Creators.updateRequest({request: req}));

        //update with new challenge
        dispatch(Creators.updateCurrent({challenge: ch}));

        //and upate analytics with new challenge info
        dispatch(topOps.challengeIssued(ch));
      }
    }
  }
}
