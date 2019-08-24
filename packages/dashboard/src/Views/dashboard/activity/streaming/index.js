import {connect} from 'react-redux';
import Stream from './ChallengeTable'; //'./Streaming';
import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';
import _ from 'lodash';
import {default as dispOps} from 'Redux/disputes/operations';

const s2p = state => {
  
  let requests = state.newRequests.byId;

  let challenges = Object.keys(state.challenges.byHash).map(k=>state.challenges.byHash[k]);
  challenges = challenges.map(c=>{
    c = {
      ...c,
      symbol: requests[c.id].symbol
    }
    return c;
  });
  challenges.sort((a,b)=>{
    return b.blockNumber - a.blockNumber; //descending so reverse comp
  });
  let loading = state.requests.loading || state.init.loading || state.challenges.loading;
   
  return {
    loading,
    challenges
  }
}

const d2p = (dispatch, own) => {
  return {
    viewDetails: id => {
      let url = navs.DETAILS_HOME + "/" + id;
      own.history.push(url);
    },
    dispute: (challenge, nonce) => {
      dispatch(dispOps.selectForDispute(challenge, nonce));
      let url = navs.DISPUTE_HOME + "/" + challenge.id;
      own.history.push(url);
    }
  }
}

export default withRouter(connect(s2p, d2p)(Stream));
