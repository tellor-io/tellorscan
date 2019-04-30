import {connect} from 'react-redux';
import Disputes from './Disputes';
import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';

const s2p = state => {
  return {

  }
}

const d2p = (dispatch,own) => {
  return {
    filterDisputes: id => {
      let url = navs.DISPUTE_HOME + "/" + id;
      own.history.push(url);
    }
  }
}

export default withRouter(connect(s2p, d2p)(Disputes));
