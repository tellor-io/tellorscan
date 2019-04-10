import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  byId: {},
  tipsById: {}
}

const initStart = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const initSuccess = (state=INIT, action) => {
  if(!action.events) {
    return {
      ...state,
      loading: false
    }
  }

  let byId = {
    ...state.byId,
    ...action.events.reduce((o,e)=>{
      o[e.id-0] = e;
      return o;
    },{})
  }

  let tipsById = {
    ...state.tipsById,
    ...action.tips.reduce((o,t)=>{
      o[t.id-0]= t.tip;
      return o;
    },{})
  }

  return {
    ...state,
    loading: false,
    byId,
    tipsById
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
    [action.event.id-0]: action.event
  };
  let tipsById = {
    ...state.tipsById,
    [action.event.id-0]: action.tip
  };

  return {
    ...state,
    byId,
    tipsById
  }
}

const updateTip = (state=INIT, action) => {
  let id = action.id-0;
  let value = action.total;
  let tips = {
    ...state.tipsById,
    [id]: value
  }
  return {
    ...state,
    tipsById: tips
  }
}

const clearAll = (state=INIT) => {
  return {
    ...INIT
  }
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_EVENT]: addEvent,
  [Types.UPDATE_TIP]: updateTip,
  [Types.CLEAR_ALL]: clearAll
}

export default createReducer(INIT, HANDLERS);
