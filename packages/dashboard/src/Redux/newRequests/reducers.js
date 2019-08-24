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
    requests: {}
  }
}

const initSuccess = (state=INIT, action) => {
  let reqs = action.requests;
  if(Array.isArray(reqs)) {
    let byId  = reqs.reduce((o, r)=>{
      o[r.id] = r;
      return o;
    },{});
    reqs = byId;
  }
  return {
    ...state,
    loading: false,
    byId: reqs
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
  let requests = {
    ...state.byId,
    [action.request.id]: action.request
  };
  return {
    ...state,
    byId: requests
  }
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_REQUEST]: addRequest
}

export default createReducer(INIT, HANDLERS);
