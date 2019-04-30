import Plugin from './Plugin';
import * as dbNames from 'Storage/DBNames';
import {findRequestById, findDisputedNonce} from 'Chain/utils';
import {Creators} from 'Redux/requests/actions';
import {
  normalizeRequest,
  normalizeDispute
}  from './utils';

const findRequest = ({txn, store, id}) => async (dispatch, getState) => {
  let byId = getState().requests.byId;
  let req = byId[id];
  if(!req) {
    req = await dispatch(findRequestById(id));
    if(req) {
      //setup for downstream storage
      store({database: dbNames.DataRequested,
        key: ""+req.id,
        data: req.toJSON()
      });
      req = normalizeRequest(req);
    }
  }
  return req;
}

const addNewDispute = ({txn, store, outData}) => async (dispatch, getState) => {
  let d = txn.logEventMap[dbNames.NewDispute];
  if(!d) {
    return;
  }
  let req = getState().requests.byId[d.requestId];
  if(!req) {
    req = await dispatch(findRequest({txn, store, id: d.requestId}));
    if(!req) {
      return;
    }
  }

  d = normalizeDispute(req, d);
  let nonce = await dispatch(findDisputedNonce(req, d));
  d.targetNonce = nonce;

  outData.request = {
    ...req,
    disputes: {
      byId: {
        ...req.disputes.byId,
        [d.id]: d
      },
      byHash: {
        ...req.disputes.byHash,
        [d.disputeHash]: d
      }
    },

  }
  store({
    database: dbNames.NewDispute,
    key: ""+d.id,
    data: d.toJSON()
  });
  outData.dispute = d;
}

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
      await dispatch(addNewDispute({txn, store, outData: outData}));
      if(outData.dispute) {
        dispatch(Creators.updateRequest({request: outData.request}));
      }
    }
  }
}
