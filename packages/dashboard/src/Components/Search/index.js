import {connect} from 'react-redux';
import Search from './Search';
import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';
import {default as reqOps} from 'Redux/newRequests/operations';

const s2p = state => {
  return {
    loading: state.requests.loading || state.init.loading
  }
}

const d2p = (dispatch,own) => {
  return {
    runSearch: id => {
      
      dispatch(reqOps.findRequestById(id))
      .then(r=>{
        if(own.resultHandler) {
          own.resultHandler(r);
        } else {
          own.history.push(navs.DETAILS_HOME + "/" + id);
        }
      })
    }
  }
}

export default withRouter(connect(s2p, d2p)(Search));
