import {connect} from 'react-redux';
import Stream from './Streaming';
import {withRouter} from 'react-router-dom';
import {default as searchOps} from 'Redux/search/operations';
import * as navs from 'Navs';

const s2p = state => {
  let mining = state.events.mining;
  let loading = state.events.requests.loading ||
                mining.loading;
  return {
    loading,
    events: mining.events
  }
}

const d2p = (dispatch, own) => {
  return {
    viewAPI: id => {
      dispatch(searchOps.search({id}))
      .then(()=>{
        let url = navs.DETAILS_HOME + "/" + id;
        own.history.push(url);
      });
    }
  }
}

export default withRouter(connect(s2p, d2p)(Stream));
