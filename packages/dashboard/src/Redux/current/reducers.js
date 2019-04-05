import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  currentChallenge: null,
  minedSlots: 0
}

const loadReq = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const _doUpdate = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    currentChallenge: action.data,
    minedSlots: action.slots || 0
  }
}

const incrSlots = (state=INIT, action) => {
  if(state.currentChallenge && state.currentChallenge.id === action.data.id) {
    return {
      ...state,
      minedSlots: state.minedSlots + 1
    }
  }
  return state;
}

const loadSuccess = (state=INIT, action) => {
  return _doUpdate(state, action);
}

const update = (state=INIT, action) => {
  return _doUpdate(state, action);
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
  [Types.FAILURE]: fail,
  [Types.UPDATE]: update,
  [Types.SLOT_MINED]: incrSlots
}

export default createReducer(INIT, HANDLERS);
