import {connect} from 'react-redux';
import Current from './CurrentApi';
import {withRouter} from 'react-router-dom';

const s2p = state => {
  let meta = state.requests.current;
  let current = null;
  if(meta) {
    current = state.requests.byId[meta.id].challenges[meta.challengeHash];
  }

  if(current && (!current.id || current.finalValue)) {
    current = null;
  }
  return {
    loading: state.requests.loading || state.init.loading,
    current
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Current));
