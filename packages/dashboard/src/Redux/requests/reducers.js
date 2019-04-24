import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  byId: {},
  current: null
}

const initStart = (state=INIT, action) => {
  return {
    ...state,
    loading: true,
    error: null,
    byId: {}
  }
}

const initSuccess = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    byId: action.data
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const addRequest = (state=INIT, action) => {
  let data = action.data;
  let req = data.request;

  let byId = {
    ...state.byId,
    [req.id]: req
  };
  return {
    ...state,
    byId
  }
}

const updateRequest = (state=INIT, action) => {
  let data = action.data;
  let req = data.request;
  let byId = {
    ...state.byId,
    [req.id]: req
  }
  return {
    ...state,
    byId
  }
}

const updateCurrent = (state=INIT, action) => {
  let data = action.data;
  let ch = data.challenge;

  return {
    ...state,
    current: ch
  }
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_REQUEST]: addRequest,
  [Types.UPDATE_REQUEST]: updateRequest,
  [Types.UPDATE_CURRENT]: updateCurrent
}

export default createReducer(INIT, HANDLERS);
