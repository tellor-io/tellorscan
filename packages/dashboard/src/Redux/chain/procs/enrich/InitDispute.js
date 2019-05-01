import Plugin from './Plugin';
import * as dbNames from 'Storage/DBNames';
import {findRequestById, findDisputedNonce} from 'Chain/utils';
import {Creators} from 'Redux/requests/actions';
import {
  normalizeRequest,
  normalizeDispute
}  from './utils';

/**
 * Find a request with the given
 */
const findRequest = ({txn, store, id}) => async (dispatch, getState) => {
  let byId = getState().requests.byId;
  let req = byId[id];
  if(!req) {
    //if it's not in the store yet, find it by looking on chain
    req = await dispatch(findRequestById(id));
    if(req) {
      //ask to store the request since we don't have it cached locally.
      store({
        database: dbNames.DataRequested,
        key: ""+req.id,
        data: req.toJSON()
      });
      //normalize just sets up some default fields we use throughout the app
      req = normalizeRequest(req);
    }
  }
  return req;
}



/**
 * Handler that enriches the Redux store with updates to request objects
 * that hold dispute information
 */
export default class InitDisputeHandler extends Plugin {
  constructor(props) {
    super({
      ...props,
      id: "InitDisputeHandler",
      fnContexts: ['beginDispute']
    });
    [
      'process'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  process(txn, store) {
    return async (dispatch, getState) => {
      let outData = {};
      //just add any disputes found in txn
      await dispatch(addNewDispute({txn, store, outData: outData}));
      if(outData.dispute) {
        //if we had a new dispute, update the request in redux store
        //by calling the action--which invokes associated reducer to update store
        dispatch(Creators.updateRequest({request: outData.request}));
      }
    }
  }
}

/**
 * Handle the addition of a new dispute event
 */
const addNewDispute = ({txn, store, outData}) => async (dispatch, getState) => {
  //see if there is a dispute even in the txn
  let d = txn.logEventMap[dbNames.NewDispute];
  if(!d) {
    return;
  }

  //get the request associated with the dispute
  let req = getState().requests.byId[d.requestId];
  if(!req) {
    //or look it up if we don't know about it yet
    req = await dispatch(findRequest({txn, store, id: d.requestId}));
    if(!req) {
      return;
    }
  }

  //normalize some fields within the dispute that we use in the dashboard
  d = normalizeDispute(req, d);

  //get the associated/disputed nonce submission for the dispute
  let nonce = await dispatch(findDisputedNonce(req, d));
  d.targetNonce = nonce;

  //make changes to the associated request
  outData.request = {
    ...req,
    //change its disputes
    disputes: {
      //to include the new dispute keyed by id
      byId: {
        ...req.disputes.byId,
        [d.id]: d
      },
      //and dispute hash
      byHash: {
        ...req.disputes.byHash,
        [d.disputeHash]: d
      }
    },
  }

  //remember that we've seen the dispute for later restoration
  store({
    database: dbNames.NewDispute,
    key: ""+d.id,
    data: d.toJSON()
  });
  //pass dispute back to caller
  outData.dispute = d;
}
