import Plugin from './Plugin';
import * as dbNames from 'Storage/DBNames';
import {Creators} from 'Redux/requests/actions';
import {findRequestById, getCurrentTipForRequest} from 'Chain/utils';
import _ from 'lodash';
import {
  normalizeRequest,
  normalizeChallenge
} from './utils';
import * as ethUtils from 'web3-utils';
import {default as topOps} from 'Redux/analytics/topRequest/operations';


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
      if(txn.fn === 'requestData') {
        return dispatch(this.handleRequestData(txn, store));
      }

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

      let req = txn.logEventMap[dbNames.DataRequested];

      let newChallenge = txn.logEventMap[dbNames.NewChallenge];
      if(!req && !newChallenge) {
        return;
      }

      let state = getState();
      let byId = state.requests.byId;

      if(req) {
        store({database: dbNames.DataRequested,
          key: ""+req.id,
          data: req.toJSON()
        });
        req = normalizeRequest(req);
      }

      if(!req) {
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
        newChallenge = normalizeChallenge(req, newChallenge);
        store({database: dbNames.NewChallenge,
          key: newChallenge.challengeHash,
          data:newChallenge.toJSON()
        });
        req.challenges[newChallenge.challengeHash] = normalizeChallenge(req,newChallenge);
        req.current = newChallenge;
        dispatch(topOps.challengeIssued(newChallenge));
      }

      //update redux with new request or existing request with its added challenge
      dispatch(Creators.addRequest({request: req}));
      if(newChallenge) {
        dispatch(Creators.updateCurrent({challenge: req.challenges[newChallenge.challengeHash]}))
      }
    }
  }

  handleTip(txn, store) {
    return async (dispatch, getState) => {
      let tipEvts = txn.logEventMap[dbNames.TipAdded];
      let ch = txn.logEventMap[dbNames.NewChallenge];
      if(!tipEvts) {
        return;
      }

      if(!Array.isArray(tipEvts)) {
        let a = [tipEvts];
        tipEvts = a;
      }
      if(tipEvts.length === 0) {
        return;
      }

      //first, increment tip amount of request


      for(let i=0;i<tipEvts.length;++i) {
        let tipEvt = tipEvts[i];
        let req = getState().requests.byId[tipEvt.id];
        if(!req) {
          req = await dispatch(findRequestById(tipEvt.id));
          if(!req) {
            console.log("Could not find request for incoming tip with id: " + tipEvt.id);
            return;
          }
          store({database: dbNames.DataRequested,
            key: ""+req.id,
            data: req.toJSON()
          });
          req = normalizeRequest(req);
        }

        let tip = tipEvt.totalTips;
        if(!txn.__recovering) {
          tip = await dispatch(getCurrentTipForRequest(req.id));
          if(!tip) {
            tip  = 0;
          }
        }

        store({
            database: dbNames.TipAdded,
            key: tipEvt.transactionHash,
            data: tipEvt.toJSON()
        });

        let tips = req.tips || [];
        tips = [
          ...tips,
          tipEvt
        ];
        if(tips.length > 50) {
          tips.splice(0, 50);
        }
        req = {
          ...req,
          currentTip: tip,
          tips
        };

        dispatch(Creators.updateRequest({request: req}));
      }//end tip event loop

      if(ch) {

        let req = getState().requests.byId[ch.id];
        if(!req) {
          req = await dispatch(findRequestById(ch.id));
          if(req) {
            store({database: dbNames.DataRequested,
              key: req.id,
              data: req.toJSON()
            });
            req = normalizeRequest(req);
          } else {
            //no request found bail out
            return;
          }
        }

        ch = normalizeChallenge(req, ch);
        store({
          database: dbNames.NewChallenge,
          key: ch.challengeHash,
          data: ch.toJSON()
        });
        req = {
          ...req,
          challenges: {
            ...req.challenges,
            [ch.challengeHash]: ch
          },
          current: ch
        }
        dispatch(Creators.updateRequest({request: req}));
        dispatch(Creators.updateCurrent({challenge: ch}));
        dispatch(topOps.challengeIssued(ch));
      }
    }
  }
}
