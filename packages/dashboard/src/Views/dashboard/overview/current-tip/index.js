import {connect} from 'react-redux';
import Tip from './CurrentTip';

const s2p = state => {
  let hash = state.challenges.currentChallenge;
  let current = null;
  if(hash) {
    current = state.challenges.byHash[hash];
  }
  let req = null;
  if(current) {
    req = state.newRequests.byId[current.id];
  }
  
  if(!current || current.finalValue) {
    return {
      tip: 0
    }
  }
  let tip = current.tip || req.currentTip;
  if(isNaN(tip)) {
    tip = 0;
  }
  return {
    tip
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Tip);
