import {connect} from 'react-redux';
import API from './APIinQ';
import {default as qOps} from 'Redux/queries/operations';
import * as navs from 'Navs';
import {withRouter} from 'react-router-dom';

const s2p = state => {
  return {
    onQ: state.queries.queries
  }
}

const d2p = (dispatch,own) => {
  return {
    viewAPI: id => {

      dispatch(qOps.select(id));
      let url = navs.DETAILS_HOME + "/" + id;
      own.history.push(url);
    }
  }
}


export default withRouter(connect(s2p, d2p)(API));
