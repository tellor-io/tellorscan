import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  data: []
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
    data: action.data
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const MAX_ITEMS = 25;
const update = (state=INIT, action) => {
  let points = [
    ...state.data,
    action.event
  ];
  if(points.length > MAX_ITEMS) {
    points = points.slice(0, MAX_ITEMS);
  }
  return {
    ...state,
    data: points
  }
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.UPDATE]: update,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
