import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  chain: null,
  contract: null
}

const loadReq = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const loadSuccess = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    chain: action.chain,
    contract: action.chain.getContract()
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
  [Types.LOAD_REQUEST]: loadReq,
  [Types.LOAD_SUCCESS]: loadSuccess,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
