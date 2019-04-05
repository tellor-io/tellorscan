import {connect} from 'react-redux';
import Current from './CurrentApi';
import {withRouter} from 'react-router-dom';

const s2p = state => {
  let current = state.current.currentChallenge;
  if(current && !current.id) {
    current = null;
  }
  return {
    current
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Current));
