import {connect} from 'react-redux';
import Tip from './CurrentTip';

const s2p = state => {
  let current = state.current.currentChallenge;
  if(!current) {
    return {
      tip: 0
    }
  }
  let req = state.events.requests.byId[current.id];
  if(!req) {
    return {
      tip: 0
    }
  }

  return {
    tip: req.tip
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Tip);
