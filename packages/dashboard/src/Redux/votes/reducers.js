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
  let byId = {};
  action.votes.forEach(v=>{
    let a = byId[v.id] || [];
    a.push(v);
    byId[v.id] = a;
  })
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


const add = (state=INIT, action) => {
  let byId = {
    ...state.byId
  };
  action.votes.forEach(v=>{
    byId[v.id] = v;
  });
  
  return {
    ...state,
    byId
  }

}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_VOTES]: add
}

export default createReducer(INIT, HANDLERS);
