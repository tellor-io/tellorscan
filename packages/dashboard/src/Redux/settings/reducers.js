import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null
}

const clearStart = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const clearOk = (state=INIT) => {
  return {
    ...state,
    loading: false
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
  [Types.CLEAR_HISTORY_START]: clearStart,
  [Types.CLEAR_HISTORY_SUCCESS]: clearOk,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
