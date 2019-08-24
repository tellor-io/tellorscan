import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  tips: [],
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
  return {
    ...state,
    loading: false,
    tips: action.tips
  }
}


const add = (state=INIT, action) => {
  let tips = [
    ...state.tips,
    ...action.tips
  ];
  while(tips.length > 50) {
    tips.shift();
  }
  return {
    ...state,
    tips
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
