import {connect} from 'react-redux';
import Current from './CurrentApi';
import {withRouter} from 'react-router-dom';

const s2p = state => {
  return {
    current: {
      id: "5",
      symbol: "DOGE" //where do we get this?
    }
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Current));
