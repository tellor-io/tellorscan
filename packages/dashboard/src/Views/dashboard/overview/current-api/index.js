import {connect} from 'react-redux';
import Current from './CurrentApi';
import {withRouter} from 'react-router-dom';

const s2p = state => {
  let hash = state.challenges.currentChallenge;
  let current = null;
  if(hash) {
    current = state.challenges.byHash[hash];
  }
  
  if(current && (!current.id || current.finalValue)) {
    current = null;
  } else if(current) {
    current = {
      ...current,
      symbol: state.newRequests.byId[current.id].symbol
    }
  }
  return {
    loading: state.newRequests.loading || state.init.loading,
    current
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Current));
