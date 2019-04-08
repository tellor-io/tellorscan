import {connect} from 'react-redux';
import Settings from './Settings';
import {withRouter} from 'react-router-dom';
import {default as setOps} from 'Redux/settings/operations';

const s2p = state => {
  return {

  }
}

const d2p = dispatch => {
  return {
    clearHistory: () => {
      return dispatch(setOps.clearHistory());
    }
  }
}

export default withRouter(connect(s2p, d2p)(Settings));
