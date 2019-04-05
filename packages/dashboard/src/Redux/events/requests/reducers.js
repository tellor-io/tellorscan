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
  let byId = {
    ...state.byId,
    ...action.events.reduce((o,e)=>{
      o[e.id] = e;
      return o;
    },{})
  }
  return {
    ...state,
    loading: false,
    byId
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const addEvent = (state=INIT, action) => {
  let byId = {
    ...state.byId,
    [action.event.id]: action.event
  };

  return {
    ...state,
    byId
  }
}

const updateTip = (state=INIT, action) => {
  let id = action.id;
  let value = action.total;
  let req = state.byId[id];
  if(req) {
    let byId = {
      ...state.byId,
      [id]: {
        ...req,
        tip: value
      }
    }
    return {
      ...state,
      byId
    }
  }
  return state;
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_EVENT]: addEvent,
  [Types.UPDATE_TIP]: updateTip
}

export default createReducer(INIT, HANDLERS);
