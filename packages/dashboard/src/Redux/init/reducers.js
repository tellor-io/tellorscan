import {Types} from './actions';
import {createReducer} from 'reduxsauce';

const INIT = {
  loading: false,
  initComplete: false,
  initStarted: false,
  error: null
}

const start = (state=INIT) => {
  return {
    ...state,
    loading: true,
    initStarted: true,
    initComplete: false,
    error: null
  }
}

const success = (state=INIT) => {
  return {
    ...state,
    initComplete: true,
    loading: false
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    initComplete: true,
    error: action.error
  }
}

const HANDLERS = {
  [Types.INIT_START]: start,
  [Types.INIT_SUCCESS]: success,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
