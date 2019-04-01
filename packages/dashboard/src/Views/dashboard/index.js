import {connect} from 'react-redux';
import Dashboard from './Dashboard';
import {withRouter} from 'react-router-dom';

//s2p short for stateToProperties
const s2p = state => {
  return {

  }
}

//d2p short for dispatchToProperties
const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Dashboard));
