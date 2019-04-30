import {Creators} from './actions';
import _ from 'lodash';
import {default as chainOps} from 'Redux/chain/operations';
import {generateDisputeHash} from 'Chain/utils';
import {toastr} from 'react-redux-toastr';

const DISPUTABLE_PERIOD = 86400; //1 day in seconds
const VOTABLE_PERIOD = 7 * 86400; //7 days to vote
const init = () => async (dispatch,getState) => {
  dispatch(Creators.initStart());
  //load disputes
  dispatch(Creators.initSuccess({}));
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
      selNonce = _.values(ch.nonces).filter(n=>n.winningOrder===0)[0];
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

const isDisputable = (challenge) => {
  if(!challenge.finalValue) {
      return true;
  }
  let diff = timeRemaining(challenge);
  return diff > 0;
}

export default {
  init,
  initDispute,
  //findByDisputeHash,
  voteUp,
  voteDown,
  selectForDispute,
  clearDisputeSelection,
  toggleDisputeSelection,
  isDisputable,
  timeRemaining,
  voteTimeRemaining

}
