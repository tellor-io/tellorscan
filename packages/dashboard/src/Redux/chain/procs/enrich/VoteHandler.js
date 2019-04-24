import Plugin from './Plugin';
import * as dbNames from 'Storage/DBNames';
import {findRequestById, findDisputedNonce} from 'Chain/utils';
import * as ethUtils from 'web3-utils';
import {Creators} from 'Redux/requests/actions';
import _ from 'lodash';

const findDispute = ({txn, store, id}) => async (dispatch, getState) => {
  let byId = getState().requests.byId;
  let reqs = _.values(byId);
  for(let i=0;i<reqs.length;++i) {
    let req = reqs[i];
    let d = req.disputes.byId[id];
    if(d) {
      return d;
    }
  }
  //we "could" pull info from on-chain to reconstruct the data. However,
  //practically, since we 7-days worth of blocks at startup, we wouldn't care
  //about old disputes anyway so we just bail here.
  return null;
}

const addVote = ({txn, store, outData}) => async (dispatch, getState) => {
  let v = txn.logEventMap[dbNames.Voted];
  if(!v) {
    return;
  }
  let disp = await dispatch(findDispute({txn, store, id:v.id}));
  if(!disp) {
    console.log("No dispute found with id", v.id);
    return;
  }
  let user = getState().chain.chain.ethereumAccount;
  store({
    database: dbNames.Voted,
    key: ethUtils.sha3(v.id + "_" + v.voter),
    data: v.toJSON()
  });
  let voteVal = v.position?1:-1;
  disp = {
    ...disp,
    voteCount: disp.voteCount + voteVal,
    userVoted: user === v.voter
  };
  let req = getState().requests.byId[disp.requestId];
  if(!req) {
    console.log("No request found with id", disp);
    return;
  }
  outData.dispute = disp;
  outData.vote = v;
  outData.request = {
    ...req,
    disputes: {
      byId: {
        ...req.disputes.byId,
        [disp.id]: disp
      },
      byHash: {
        ...req.disputes.byHash,
        [disp.disputeHash]: disp
      }
    }
  }
}

export default class VoteHandler extends Plugin {
  constructor(props) {
    super({
      ...props,
      id: "VoteHandler",
      fnContexts: ['vote']
    });
    [
      'process'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  process(txn, store) {
    return async (dispatch, getState) => {
      let state = getState();
      let outData = {};
      await dispatch(addVote({txn, store, outData: outData}));
      if(outData.dispute) {
        dispatch(Creators.updateRequest({request: outData.request}));
      }
    }
  }
}
