import {connect} from 'react-redux';
import Buttons from './VoteButtons';
import {default as dispOps} from 'Redux/disputes/operations';

const s2p = (state,own) => {
  let disp = own.dispute;
  let con = state.chain.contract;
  let user = state.chain.chain.ethereumAccount || "";
  user = user.toLowerCase();
  let canVote = false;
  let voteReason = "no dispute";

  if(disp) {
    if(disp.userVoted) {
      canVote = false;
      voteReason = "already voted";
    } else if(disp.sender === user) {
      canVote = false;
      voteReason = "dispute owner";
    } else {
      canVote = true;
    }
  }
  return {
    canVote,
    voteReason
  }
}

const d2p = (dispatch,own) => {
  return {
    voteUp: () => {
      dispatch(dispOps.voteUp(own.dispute));
    },
    voteDn: () => {
      dispatch(dispOps.voteDown(own.dispute));
    }
  }
}

export default connect(s2p, d2p)(Buttons);
