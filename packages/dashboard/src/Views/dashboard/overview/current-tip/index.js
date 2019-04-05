import {connect} from 'react-redux';
import Tip from './CurrentTip';

const s2p = state => {
  let current = state.current || {};
  return {
    tip: current.tip || 0
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Tip);
