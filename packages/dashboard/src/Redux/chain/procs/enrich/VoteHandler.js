import Plugin from './Plugin';
import * as dbNames from 'Storage/DBNames';
import * as ethUtils from 'web3-utils';
import {Creators} from 'Redux/requests/actions';
import _ from 'lodash';
import eventFactory from 'Chain/LogEvents/EventFactory';

/**
 * Handling voting related events and txns
 */
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
      let outData = {};
      //extract voting info
      await dispatch(addVote({txn, store, outData: outData}));
      if(outData.dispute) {
        //and if matched up with dispute, update request
        dispatch(Creators.updateRequest({request: outData.request}));
      }
    }
  }
}

/**
 * Find a matching dispute for a vote by the dispute id
 */
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
  //we don't have a local match. We need to reconstruct from on-chain info
  let disp = await getState().chain.contract.getDisputeDetails(id);
  if(disp) {
    let payload = {
      event: dbNames.NewDispute,
      sender: txn.from,
      fnContext: txn.fn,
      transactionHash: txn.transactionHash,
      blockNumber: txn.blockNumber,
      transactionIndex: txn.transactionIndex,
      logIndex: 0,
      timestamp: txn.timestamp,
      returnValues: disp
    };
    return eventFactory(payload);
  }
}

/**
 * Add a vote event if in txn
 */
const addVote = ({txn, store, outData}) => async (dispatch, getState) => {
  let v = txn.logEventMap[dbNames.Voted];
  if(!v) {
    return;
  }

  //find the matching dispute
  let disp = await dispatch(findDispute({txn, store, id:v.id}));
  if(!disp) {
    console.log("No dispute found with id", v.id);
    return;
  }

  //cache the vote for future recovery
  store({
    database: dbNames.Voted,
    key: ethUtils.sha3(v.id + "_" + v.voter),
    data: v.toJSON()
  });

  //see if voter is the current user
  let user = getState().chain.chain.ethereumAccount;
  let voteVal = v.position?1:-1;
  //increment/decrement voter counts
  disp = {
    ...disp,
    voteCount: disp.voteCount + voteVal,
    //if current user voted or not
    userVoted: user === v.voter
  };

  let req = getState().requests.byId[disp.requestId];
  if(!req) {
    console.log("No request found with id", disp);
    return;
  }
  outData.dispute = disp;
  outData.vote = v;
  //update request with the new dispute event
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
