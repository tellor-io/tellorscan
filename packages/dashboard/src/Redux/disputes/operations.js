import {Creators} from './actions';
import _ from 'lodash';
import {default as chainOps} from 'Redux/chain/operations';
import {generateDisputeHash} from 'Chain/utils';
import {toastr} from 'react-redux-toastr';
import Storage from 'Storage';
import * as DBNames from 'Storage/DBNames';
import * as ethUtils from 'web3-utils';
import {Logger} from 'buidl-utils';
import {default as chOps} from 'Redux/challenges/operations';

const log = new Logger({component: "DisputeOps"});

const DISPUTABLE_PERIOD = 86400; //1 day in seconds
const VOTABLE_PERIOD = 7 * 86400; //7 days to vote
const init = () => async (dispatch,getState) => {
  dispatch(Creators.initStart());
  //load disputes
  let r =  await Storage.instance.readAll({
    database: DBNames.NewDispute,
    limit: 100,
    sort: [
      {
        field: "blockNumber",
        order: "DESC"
      }
    ]
  });
  let disputes = [];
  for(let i=0;i<r.length;++i) {
    let d = r[i];
    let nonce = await dispatch(chOps.findDisputedNonce({requestId: d.requestId, 
                                                        miner: d.miner, 
                                                        mineTime: d.mineTime}));
    if(!nonce) {
      log.warn("Could not find matching nonce for dispute, have to ignore it");
    } else {
      disputes.push({
        ...d,
        targetNonce: nonce
      })
    }
  }
  
  dispatch(Creators.initSuccess(disputes));
}

const selectForDispute = (ch, nonce) => dispatch => {
  dispatch(Creators.selectForDispute(ch, nonce));
}

const clearDisputeSelection = () => dispatch => {
  dispatch(Creators.selectForDispute(null, null));
}

const toggleDisputeSelection = (ch) => (dispatch,getState) => {
  let state = getState();
  let selCh = state.disputes.selectedChallenge || {};
  if(selCh.challengeHash === ch.challengeHash) {
    dispatch(clearDisputeSelection());
  } else {
    let selNonce = state.disputes.selectedNonce;
    if(!selNonce) {
      let nonces = ch.nonces || [];
      selNonce = nonces[0];
    }
    dispatch(selectForDispute(ch, selNonce));
  }
}

const findByDisputeHash = (hash) => (dispatch) => {
  //return dispatch(Dispute.ops.findByDisputeHash(hash));
}

const initDispute = props => async (dispatch,getState) => {

  let hash = generateDisputeHash({miner: props.miner.address, requestId: props.requestId, timestamp: props.timestamp});
  let ex = await dispatch(findByDisputeHash(hash));
  if(ex) {
    toastr.error("Exists", "That dispute already exists. Updated UI from on-chain information");
    return;
  }
  return dispatch(chainOps.initDispute(props));
}

const voteUp = dispute =>  (dispatch, getState) => {
  return dispatch(_vote(dispute, true));
}

const voteDown = dispute => (dispatch, getState) => {
  return dispatch(_vote(dispute, false));
}

const _vote = (dispute,pos) => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  let addr = state.chain.chain.ethereumAccount;
  if(addr) {
    let voted = await con.didVote(dispute.id, addr);
    if(voted) {
      toastr.error("Error", "Selected account already voted for this dispute");
    } else {
      await con.vote(dispute.id, pos);
      toastr.info("Vote Cast", "Your vote has been cast");
    }
  }
}

const timeRemaining = (challenge) => {
  let now = Math.floor(Date.now()/1000);
  let end = challenge.finalValue?challenge.finalValue.mineTime:0;
  return DISPUTABLE_PERIOD - (now - end);
}

const voteTimeRemaining = (dispute) => {
  let now = Math.floor(Date.now()/1000);
  let end = dispute.timestamp || 0;
  return VOTABLE_PERIOD - (now - end);
}

export const isDisputable = (challenge) => {

  if(!challenge.finalValue) {
      return true;
  }
  let diff = timeRemaining(challenge);
  return diff > 0;
}

export const addDisputes = (disputes) => dispatch => {
  dispatch(Creators.addDisputes(disputes));
}

export default {
  init,
  initDispute,
  addDisputes,
  voteUp,
  voteDown,
  selectForDispute,
  clearDisputeSelection,
  toggleDisputeSelection,
  isDisputable,
  timeRemaining,
  voteTimeRemaining

}
