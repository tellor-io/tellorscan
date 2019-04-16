import {connect} from 'react-redux';
import Modal from './RequestDataModal';
import {default as modalOps} from 'Redux/modals/operations';
import {default as chainOps} from 'Redux/chain/operations';
import {default as reqOps} from 'Redux/events/tree/operations';

import {withRouter} from 'react-router-dom';
import * as navs from 'Navs';

const ID = "requestData";

const s2p = state => {
  let data = state.modals.data[ID] || {};
  return {
    showing: state.modals.visible[ID],
    data: data,
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
    showDetails: id => {
      //first retrieve data if we don't already have it
      dispatch(modalOps.isLoading(ID, true));
      dispatch(reqOps.findRequestId(id))
      .then(()=>{
        dispatch(modalOps.hide(ID));
        own.history.push(navs.DETAILS_HOME + '/' + id)
      })
    },
    onSubmit: async data => {
      let req = {
        queryString: data.queryString,
        apiId: 0,
        multiplier: data.multiplier,
        tip: data.tip,
        symbol: data.symbol
      }
      dispatch(modalOps.isLoading(ID, true));
      let id = await dispatch(chainOps.lookupQueryByHash(req));
      if(id) {
        dispatch(modalOps.isLoading(ID, false));
        dispatch(modalOps.collect(ID, {entryExists: id}));
      } else {
        return dispatch(chainOps.requestData(req))
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
}

export default withRouter(connect(s2p, d2p)(Modal));
