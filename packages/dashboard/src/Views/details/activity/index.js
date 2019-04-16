import {connect} from 'react-redux';
import Activity from './Activity';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import * as navs from 'Navs';
import {default as dispOps} from 'Redux/disputes/operations';

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
    selectForDispute: (ch, nonce) => {
      dispatch(dispOps.selectForDispute(ch, nonce));
      let url = navs.DISPUTE_HOME + "/" + ch.id;
      own.history.push(url);
    }
  }
}

export default withRouter(connect(s2p, d2p)(Activity));
