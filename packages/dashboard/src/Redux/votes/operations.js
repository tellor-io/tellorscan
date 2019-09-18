import {Creators} from './actions';
import _ from 'lodash';
import {toastr} from 'react-redux-toastr';
import Storage from 'Storage';
import * as DBNames from 'Storage/DBNames';
import {Logger} from 'buidl-utils';
import {default as dispOps} from 'Redux/disputes/operations';

const log = new Logger({component: "VoteOps"});

const DISPUTABLE_PERIOD = 86400; //1 day in seconds
const VOTABLE_PERIOD = 7 * 86400; //7 days to vote
const init = () => async (dispatch,getState) => {
  dispatch(Creators.initStart());
  //load disputes
  let r =  await Storage.instance.readAll({
    database: DBNames.Voted,
    limit: 100,
    sort: [
      {
        field: "blockNumber",
        order: "DESC"
      }
    ]
  });
  
  dispatch(Creators.initSuccess(r));
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

const voteTimeRemaining = (dispute) => {
  let now = Math.floor(Date.now()/1000);
  let end = dispute.timestamp || 0;
  return VOTABLE_PERIOD - (now - end);
}

export const addVotes = (votes) => dispatch => {
  dispatch(Creators.addVotes(votes));
}

export default {
  init,
  addVotes,
  voteUp,
  voteDown,
  voteTimeRemaining
}
