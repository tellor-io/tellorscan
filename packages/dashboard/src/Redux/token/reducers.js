import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  balance: 0
}

const start = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const success = (state=INIT, action) => {
  let data = action.data || {};
  return {
    ...state,
    loading: false,
    balance: data.balance || 0
  }
}

const update = (state=INIT, action) => {
  let data = action.data;
  return {
    ...state,
    balance: data.balance || 0
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const HANDLERS = {
  [Types.INIT_START]: start,
  [Types.INIT_SUCCESS]: success,
  [Types.UPDATE]: update,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
