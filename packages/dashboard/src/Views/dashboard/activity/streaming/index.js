import {connect} from 'react-redux';
import Stream from './ChallengeTable'; //'./Streaming';
import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';
import _ from 'lodash';

const s2p = state => {
  //let mining = state.events.mining;
  let byId = state.events.tree.byId;
  let currentChallenge  = state.current.currentChallenge || {};

  let requests = _.values(byId) || [];
  let challenges = [];
  requests.forEach(r=>{
    let rc = r.challenges; //by hash
    _.values(rc).forEach(c=>challenges.push(c))
  });
  challenges.sort((a,b)=>{
    if(a.id === currentChallenge.id && a.challengeHash === currentChallenge.challengeHash) {
      return -1;
    }
    return b.blockNumber - a.blockNumber; //descending so reverse comp
  });

  let loading = state.events.tree.loading;
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
    }
  }
}

export default withRouter(connect(s2p, d2p)(Stream));
