import {connect} from 'react-redux';
import Dashboard from './Dashboard';
import {withRouter} from 'react-router-dom';
import {default as modalOps} from 'Redux/modals/operations';

const s2p = state => {
  return {

  }
}

const d2p = dispatch => {
  return {
    requestData: (props) => dispatch(modalOps.show("requestData"))
  }
}

export default withRouter(connect(s2p, d2p)(Dashboard));
