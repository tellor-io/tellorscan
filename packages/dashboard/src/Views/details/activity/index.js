import {connect} from 'react-redux';
import Activity from './Activity';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';

const s2p = (state,own) => {
  let id = own.match.params['apiID'];
  let req = state.events.tree.byId[id] || {};
  let current = state.current.currentChallenge || {};

  let challenges = _.values(req.challenges);
  //put any current challenge on the top
  challenges.sort((a,b)=>{
    if(a.challengeHash === current.challengeHash) {
      return -1;
    }
    if(b.challengeHash === current.challengeHash) {
      return -1;
    }
    return b.blockNumber - a.blockNumber;
  });

  return {
    challenges
  }
}

const d2p = (dispatch,own) => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Activity));
