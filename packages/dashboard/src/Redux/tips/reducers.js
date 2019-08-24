import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  tips: [],
  byId: {},
  selectedRequest: null
}

const start = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const success = (state=INIT, action) => {
  let byId = {
    ...state.byId
  }
  action.tips.forEach(t=>byId[t.id]=t);
  return {
    ...state,
    loading: false,
    tips: action.tips,
    byId
  }
}


const add = (state=INIT, action) => {
  let tips = [
    ...state.tips,
    ...action.tips
  ];
  let byId = {
    ...state.byId
  }
  while(tips.length > 50) {
    tips.shift();
  }
  tips.forEach(t=>byId[t.id]=t);
  return {
    ...state,
    tips,
    byId
  }
}

const select = (state=INIT, action) => {
  return {
    ...state,
    selectedRequest: action.request
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    error: action.error
  }
}

const HANDLERS = {
  [Types.INIT_START]: start,
  [Types.INIT_SUCCESS]: success,
  [Types.ADD_TIPS]: add,
  [Types.SELECT_FOR_TIP]: select,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
