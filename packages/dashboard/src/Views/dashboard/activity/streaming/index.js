import {connect} from 'react-redux';
import Stream from './Streaming';
import {withRouter} from 'react-router-dom';

const s2p = state => {
  return {
    events: [
      {
        id: "5",
        symbol: "DOGE-USD",
        type: "Mined",
        value: "$147.43"
      }
    ]
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Stream));
