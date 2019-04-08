import {connect} from 'react-redux';
import Menu from './TopMenu';
import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';

const s2p = state => {
  return {

  }
}

const d2p = (dispatch,own) => {
  return {
    goHome: () => own.history.push(navs.HOME),
    toDisputes: () => own.history.push(navs.DISPUTE_HOME),
    toSettings: () => own.history.push(navs.SETTINGS_HOME)
  }
}

export default withRouter(connect(s2p, d2p)(Menu));
