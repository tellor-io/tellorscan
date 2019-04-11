import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  byId: {}
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
    byId: action.tips
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
  let byId = {
    ...state.byId,
    [action.id]: action.tip
  }
  return {
    ...state,
    byId
  }
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.UPDATE]: update
}

export default createReducer(INIT, HANDLERS);
