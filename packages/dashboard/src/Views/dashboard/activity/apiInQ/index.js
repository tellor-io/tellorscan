import {connect} from 'react-redux';
import API from './APIinQ';
import {default as chainOps} from 'Redux/chain/operations';
import {default as searchOps} from 'Redux/search/operations';
import * as navs from 'Navs';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import {toastr} from 'react-redux-toastr';

const s2p = state => {
  let byId = state.events.requests.byId;
  let events = _.keys(byId).map(k=>byId[k]);
  let tips = state.events.requests.tipsById;

  events = events.map(e=>{
    let tip = tips[e.id];

    if(tip === 'undefined') {
      tip = e.value;
    }
    return {
      ...e,
      value: tip
    }
  });
  let loading = state.events.requests.loading || state.search.loading;
  return {
    loading,
    onQ: events
  }
}

const d2p = (dispatch,own) => {
  return {
    viewAPI: id => {
      dispatch(searchOps.search({id}))
      .then(()=>{
        let url = navs.DETAILS_HOME + "/" + id;
        own.history.push(url);
      })
    },

    addTip: async (id, tip) => {
      try {
        await dispatch(chainOps.addToTip(id, tip));
      } catch (e) {
        toastr.error("Error", e.message);
      }
    }
  }
}


export default withRouter(connect(s2p, d2p)(API));
