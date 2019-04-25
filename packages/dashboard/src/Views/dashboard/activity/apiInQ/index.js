import {connect} from 'react-redux';
import API from './APIinQ';
import {default as tipOps} from 'Redux/tips/operations';
import * as navs from 'Navs';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import {toastr} from 'react-redux-toastr';

const s2p = state => {
  let byId = state.requests.byId;
  let events = _.keys(byId).map(k=>byId[k]);
  events.sort((a,b)=>{
    return b.currentTip - a.currentTip
  });
  let loading = state.requests.loading || state.init.loading;
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

    addTip: async (id) => {
      try {
        //await dispatch(chainOps.addToTip(id, tip));
        dispatch(tipOps.showTipModal(id));
      } catch (e) {
        toastr.error("Error", e.message);
      }
    }
  }
}


export default withRouter(connect(s2p, d2p)(API));
