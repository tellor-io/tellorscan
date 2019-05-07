import {connect} from 'react-redux';
import Modal from './TokenModal';
import {default as modalOps} from 'Redux/modals/operations';
import {default as chainOps} from 'Redux/chain/operations';

import {withRouter} from 'react-router-dom';

const ID = "getTokens";

const s2p = state => {
  let data = state.modals.data[ID] || {};

  return {
    showing: state.modals.visible[ID],
    data: data,
    loading: state.modals.loading[ID],
    error: state.modals.errors[ID]
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
      let addr = data.address;
      dispatch(modalOps.isLoading(ID, true));

      return dispatch(chainOps.getTokens(addr))
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
