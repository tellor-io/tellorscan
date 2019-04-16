import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  data: {}
}

const initStart = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const initSuccess = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    data: action.data
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const update = (state=INIT, action) => {
  let data = {
    ...state.data,
    ...action.data
  }
  return {
    ...state,
    data
  }
}

const select = (state=INIT, action) => {
  return {
    ...state,
    selectedChallenge: action.challenge,
    selectedNonce: action.nonce
  }
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.UPDATE]: update,
  [Types.SELECT_FOR_DISPUTE]: select
}

export default createReducer(INIT, HANDLERS);
