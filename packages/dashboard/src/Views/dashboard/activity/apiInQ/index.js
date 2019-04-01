import {connect} from 'react-redux';
import API from './APIinQ';

const s2p = state => {
  return {
    onQ: [
      {
        id: 5,
        symbol: "DOGE-USD",
        tip: 4
      }
    ]
  }
}

const d2p = dispatch => {
  return {

  }
}


export default connect(s2p, d2p)(API);
