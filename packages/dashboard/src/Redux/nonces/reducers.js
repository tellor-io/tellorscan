import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  byHash: {}
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
  let nonces = action.nonces || [];
  nonces.forEach(n=>{
    let a = byHash[n.challengeHash] || []
    let asMap = a.reduce((o,nn)=>{
      o[nn.miner] = nn;
      return o;
    },{});
    asMap[n.miner] = n;
    byHash[n.challengeHash] = Object.keys(asMap).map(k=>asMap[k]);
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
  
  let nonces = action.nonces || [];
  nonces.forEach(n=>{
    let a = byHash[n.challengeHash] || []
    let asMap = a.reduce((o,nn)=>{
      o[nn.miner] = nn;
      return o;
    },{});
    asMap[n.miner] = n;
    byHash[n.challengeHash] = Object.keys(asMap).map(k=>asMap[k]);
  });
  
  return {
    ...state,
    loading: false,
    byHash
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
  [Types.ADD_NONCES]: add,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
