import {connect} from 'react-redux';
import Slots from './Slots';

const s2p = state => {
  return {
    filled: [true, true, false, false, false]
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Slots);
