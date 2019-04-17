import {Creators} from './actions';
import Dispute from 'Redux/events/tree/model/Dispute';
import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';

const init = () => async (dispatch,getState) => {
  dispatch(Creators.initStart());
  //load disputes
  dispatch(Creators.initSuccess({}));
}

const selectForDispute = (ch, nonce) => dispatch => {
  dispatch(Creators.selectForDispute(ch, nonce));
}

const clearDisputeSelection = () => dispatch => {
  dispatch(Creators.selectForDispute(null, null));
}

const toggleDisputeSelection = (ch) => (dispatch,getState) => {
  let state = getState();
  let selCh = state.disputes.selectedChallenge || {};
  if(selCh.challengeHash === ch.challengeHash) {
    dispatch(clearDisputeSelection());
  } else {
    let selNonce = state.disputes.selectedNonce || ch.nonces[0];
    dispatch(selectForDispute(ch, selNonce));
  }
}

const findByDisputeHash = (hash) => (dispatch) => {
  return dispatch(Dispute.ops.findByDisputeHash(hash));
}

export default {
  init,
  findByDisputeHash,
  selectForDispute,
  clearDisputeSelection,
  toggleDisputeSelection

}
