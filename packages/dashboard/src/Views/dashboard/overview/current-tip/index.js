import {connect} from 'react-redux';
import Tip from './CurrentTip';

const s2p = state => {
  let meta = state.requests.current;
  let current = null;
  if(meta) {
    current = state.requests.byId[meta.id].challenges[meta.challengeHash];
  }

  if(!current || current.finalValue) {
    return {
      tip: 0
    }
  }
  let tip = current.tip || current.value;
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
