import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Pending from './Pending';
import * as navs from 'Navs';
import _ from 'lodash';
import {default as dispOps} from 'Redux/disputes/operations';

const s2p = (state,own) => {
  let chain = state.chain.chain || {};
  let user = chain.ethereumAccount || "";
  user = user.toLowerCase();
  let reqById = state.newRequests.byId;

  let all = [];
  _.values(state.disputes.byId).forEach(d=>{
    
    let canVote = true;
    let voteReason = null;
    if(state.token.balance <= 0) {
      canVote = false;
      voteReason = "need tokens";
    }
    if(d.userVoted) {
      canVote = false;
      voteReason = "already voted"
    }
    if(d.sender === user) {
      canVote = false;
      voteReason = "dispute owner";
    }

    all.push({
        ...d,
        request: reqById[d.requestId],
        timeRemaining: dispOps.voteTimeRemaining,
        canVote,
        voteReason
      });
  });
  all.sort((a,b)=>{
    let aRem = dispOps.voteTimeRemaining(a);
    let bRem = dispOps.voteTimeRemaining(b);
    return aRem - bRem;
  }); //those ending first

  return {
    disputes: all,
    loading: false
  }
}

const d2p = (dispatch,own) => {
  return {
    viewRequestDetails: id => {
      let url = navs.DETAILS_HOME + '/' + id;
      own.history.push(url);
    }
  }
}

export default withRouter(connect(s2p,d2p)(Pending));
