import {connect} from 'react-redux';
import Tip from './CurrentTip';

const s2p = state => {
  return {
    tip: 5
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Tip);
