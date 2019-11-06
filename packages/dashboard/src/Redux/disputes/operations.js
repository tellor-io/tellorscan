import {Creators} from './actions';
import _ from 'lodash';
import {default as chainOps} from 'Redux/chain/operations';
import {generateDisputeHash, findDisputeById as findDispute} from 'Chain/utils';
import {toastr} from 'react-redux-toastr';
import Storage from 'Storage';
import * as DBNames from 'Storage/DBNames';
import {Logger} from 'buidl-utils';
import {default as chOps} from 'Redux/challenges/operations';
import {Types as voteTypes} from 'Redux/votes/actions';
import {registerDeps} from 'Redux/DepMiddleware';

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
  registerDeps([voteTypes.ADD_VOTES], action => {
    action.votes.forEach(v=>{
      let d = dispatch(findDisputeById(v.id));
      let user = getState().chain.chain.ethereumAccount;
      let tally = d.voteCount || 0;
      tally += v.agreesWithDisputer?1:-1;
      if(d) {
        d = {
          ...d,
          userVoted: v.voter.toLowerCase() === user,
          voteCount: tally
        }
        dispatch(Creators.update(d));
      }
    })
  });

  let disputes = [];
  for(let i=0;i<r.length;++i) {
    let d = r[i];
    let {nonce,challenge} = await dispatch(chOps.findDisputedNonce({requestId: d.requestId, 
                                                        miner: d.miner, 
                                                        mineTime: d.mineTime}));
    let votes = getState().votes.byId[d.id];
    let tally = 0;
    let userVoted = false;
    let user = getState().chain.chain.ethereumAccount;
    if(votes) {
      votes.forEach(v=>{
        tally += (v.agreesWithDisputer?1:-1);
        if(v.voter.toLowerCase() === user) {
          userVoted = true;
        }
      })
    }
    if(!nonce) {
      log.warn("Could not find matching nonce for dispute, have to ignore it");
    } else {
      disputes.push({
        ...d,
        targetNonce: nonce,
        targetChallenge: challenge,
        voteCount: tally,
        userVoted
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

const findByDisputeHash = (hash) => (dispatch,getState) => {
  //return dispatch(Dispute.ops.findByDisputeHash(hash));
  return getState().disputes.byHash[hash];
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
  if(challenge) {
    let now = Math.floor(Date.now()/1000);
    let end = challenge.finalValue?challenge.finalValue.mineTime:0;
    return DISPUTABLE_PERIOD - (now - end);
  }
  log.warn("Missing challenge to compute remaining time");
  return 0;
}

const voteTimeRemaining = (dispute) => {
  let challenge  = dispute.targetChallenge;
  if(challenge) {
    let now = Math.floor(Date.now()/1000);
    let end = challenge.finalValue?challenge.finalValue.mineTime:0;
    return VOTABLE_PERIOD - (now - end);
  }
  log.warn("Dispute is missing target challenge to compute vote period")
  return 0;
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

const resolveSender = (dispute,web3) => async (dispatch,getState) => {
  if(!web3) {
    web3 = getState().chain.web3;
  }
  if(!web3) {
    log.warn("Could not resolve web3 to lookup dispute sender");
    return;
  }

  if(dispute.sender) {
    return;
  }
  if(dispute.transactionHash) {
    let r = await web3.eth.getTransactionReceipt(dispute.transactionHash);
    if(r) {
      dispute.sender = r.from.toLowerCase();
    } else {
      log.warn("Could not resolve transation for dispute", dispute.transactionHash);
    }
  } else {
    log.warn("Dispute is missing transaction hash to lookup sender");
  }
}

const findDisputeById = id => (dispatch, getState) => {
  return getState().disputes.byId[id];
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
  voteTimeRemaining,
  resolveSender,
  findDisputeById
}
