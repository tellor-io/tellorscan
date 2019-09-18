import {connect} from 'react-redux';
import Activity from './Activity';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import * as navs from 'Navs';
import {default as dispOps} from 'Redux/disputes/operations';

const s2p = (state,own) => {
  let id = own.match.params['apiID'];
  if(typeof id !== 'undefined') {
    id -= 0;
  }
  let req = state.newRequests.byId[id] || {}; //state.events.tree.byId[id] || {};
  let hash = state.challenges.currentChallenge;
  let current = null;
  if(hash) {
    current = state.challenges.byHash[hash] || {};
  }

  let challenges = _.values(state.challenges.byHash);
  if(id) {
    challenges = challenges.filter(c=>{
      return c.id===id
    });
  }
  
  //put any current challenge on the top
  challenges.sort((a,b)=>{
    if(current && a.challengeHash === current.challengeHash) {
      return -1;
    }
    if(current && b.challengeHash === current.challengeHash) {
      return -1;
    }
    return b.blockNumber - a.blockNumber;
  });

  return {
    challenges: challenges.map(c=>{
      return {
        ...c,
        symbol: req.symbol
      }
    })
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
