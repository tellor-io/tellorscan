import {connect} from 'react-redux';
import Top from './TopApi';

const s2p = state => {
  let current = state.current.query || {
    symbol: "no query history"
  };
  return {
    top: current.symbol || "no symbol"
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Top);
