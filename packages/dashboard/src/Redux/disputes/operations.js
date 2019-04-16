import {Creators} from './actions';

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

export default {
  init,
  selectForDispute,
  clearDisputeSelection,
  toggleDisputeSelection

}
