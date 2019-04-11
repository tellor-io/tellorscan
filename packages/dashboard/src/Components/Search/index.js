import {connect} from 'react-redux';
import Search from './Search';
import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';
import {default as reqOps} from 'Redux/events/tree/operations';

const s2p = state => {
  return {
    loading: state.events.tree.loading
  }
}

const d2p = (dispatch,own) => {
  return {
    runSearch: id => {
      dispatch(reqOps.findByRequestId(id))
      .then(r=>{
        own.history.push(navs.DETAILS_HOME + "/" + id);
      })
    }
  }
}

export default withRouter(connect(s2p, d2p)(Search));
