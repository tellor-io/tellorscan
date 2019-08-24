import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  byHash: {},
  //this is only kept for incoming values, not persisted directly. Indirectly, the winning order 
  //is held in NonceSubmitted objects that are persisted with that order. The order is filled in
  //when new values are added. See Redux/nonces/operations to see how this is done.
  miningOrderByHash: {} 
}

const start = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const success = (state=INIT, action) => {
  let all = action.challenges;
  let byHash = {};
  let values = action.values || [];
  values.forEach(v=>{
    byHash[v.challengeHash] = v;
  });
  
  return {
    ...state,
    loading: false,
    byHash
  }
}


const add = (state=INIT, action) => {

  let byHash = {
    ...state.byHash
  };

  let miningOrderByHash = {
    ...state.miningOrderByHash
  }
  
  let values = action.values || [];
  values.forEach(v=>{
    let nv = v.newValue;
    let miners = v.miners;
    byHash[nv.challengeHash] = nv;
    miningOrderByHash[nv.challengeHash] = miners;
  });
  
  return {
    ...state,
    loading: false,
    byHash,
    miningOrderByHash
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
  [Types.INIT_START]: start,
  [Types.INIT_SUCCESS]: success,
  [Types.ADD_NEW_VALUES]: add,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
