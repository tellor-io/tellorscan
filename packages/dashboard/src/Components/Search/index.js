import {connect} from 'react-redux';
import Search from './Search';
import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';
import {default as searchOps} from 'Redux/search/operations';

const s2p = state => {
  return {
    loading: state.search.loading
  }
}

const d2p = (dispatch,own) => {
  return {
    runSearch: id => {
      dispatch(searchOps.search({id}))
      .then(()=>{
        own.history.push(navs.DETAILS_HOME + "/" + id)
      })
    }
  }
}

export default withRouter(connect(s2p, d2p)(Search));
