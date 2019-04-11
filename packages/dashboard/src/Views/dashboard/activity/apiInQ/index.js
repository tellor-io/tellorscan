import {connect} from 'react-redux';
import API from './APIinQ';
import {default as chainOps} from 'Redux/chain/operations';
import * as navs from 'Navs';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import {toastr} from 'react-redux-toastr';

const s2p = state => {
  let byId = state.events.tree.byId;
  let events = _.keys(byId).map(k=>byId[k]);
  let tips = state.tips.byId;

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
  let loading = state.events.tree.loading;
  return {
    loading,
    onQ: events
  }
}

const d2p = (dispatch,own) => {
  return {
    viewAPI: id => {
      let url = navs.DETAILS_HOME + "/" + id;
      own.history.push(url);
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
