import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Pending from './Pending';
import moment from 'moment';
import * as navs from 'Navs';
import _ from 'lodash';
import {default as dispOps} from 'Redux/disputes/operations';

const s2p = (state,own) => {
  let reqsById = state.requests.byId; //state.events.tree.byId;
  let chain = state.chain.chain || {};
  let user = chain.ethereumAccount || "";
  user = user.toLowerCase();

  let all = [];
  _.values(reqsById).forEach(r=>{
    let ds = r.disputes.byId || {};
    let challenges = r.challenges || {};

  _.values(ds).forEach(d=>{
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
        request: r,
        timeRemaining: dispOps.voteTimeRemaining,
        canVote,
        voteReason
      });
    })
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
