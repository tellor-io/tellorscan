import {connect} from 'react-redux';
import API from './APIinQ';
import {default as qOps} from 'Redux/queries/operations';
import {default as chainOps} from 'Redux/chain/operations';
import * as navs from 'Navs';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';

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
  return {
    onQ: events
  }
}

const d2p = (dispatch,own) => {
  return {
    viewAPI: id => {

      dispatch(qOps.select(id));
      let url = navs.DETAILS_HOME + "/" + id;
      own.history.push(url);
    },

    addTip: (id, tip) => {
      dispatch(chainOps.addToTip(id, tip));
    }
  }
}


export default withRouter(connect(s2p, d2p)(API));
