import {connect} from 'react-redux';
import Pending from './Pending';

const mock = [
  {
    id: 1,
    multiplier: 1000,
    value: 154.32,
    timestamp: 1555089275,
    timeLeft: 'about a day',
    tally: 50
  }
]

const s2p = (state,own) => {

  return {
    disputes: [],
    loading: false
  }
}

const d2p = (dispatch,own) => {
  return {

  }
}

export default connect(s2p,d2p)(Pending);
