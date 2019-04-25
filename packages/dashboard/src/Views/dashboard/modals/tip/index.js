import {connect} from 'react-redux';
import Modal from './TipModal';
import {default as modalOps} from 'Redux/modals/operations';
import {default as chainOps} from 'Redux/chain/operations';
import _ from 'lodash';

import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';

const ID = "addTip";

const s2p = state => {
  let data = state.modals.data[ID] || {
    request: state.tips.selectedRequest
  };
  let top = 0;
  _.values(state.requests.byId).forEach(r=>{
    if(r.currentTip > top) {
      top = r.currentTip
    }
  });

  return {
    showing: state.modals.visible[ID],
    data: data,
    request: state.tips.selectedRequest,
    tipInfo: {
      topTip: top,
      suggestedTip: top+1 //for now
    },
    loading: state.modals.loading[ID],
    error: state.modals.errors[ID],
    entryExists: data.entryExists
  }
}

const d2p = (dispatch,own) => {
  return {
    cancel: () => {
      dispatch(modalOps.hide(ID))
    },
    collect: data => {
      dispatch(modalOps.collect(ID, data));
    },

    onSubmit: async data => {
      let tip = data.tip;
      let req = data.request;
      dispatch(modalOps.isLoading(ID, true));

      return dispatch(chainOps.addToTip(req.id, tip-0))
              .then(()=>{
                dispatch(modalOps.clear(ID));
                dispatch(modalOps.isLoading(ID, false));
                dispatch(modalOps.hide(ID))
              }).catch(e=>{
                dispatch(modalOps.failure(ID, e));
              })

    }
  }
}

export default withRouter(connect(s2p, d2p)(Modal));
