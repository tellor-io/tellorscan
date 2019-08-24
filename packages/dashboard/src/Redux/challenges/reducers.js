import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  byHash: {},
  currentChallenge: null
}

//FIXME: we need to change this to paging with start/end offsets 
//and read from history as needed
const MAX_SIZE = 50; 

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
  action.challenges.forEach(c=>{
    byHash[c.challengeHash] = c;
  });
  let raw = Object.keys(byHash).map(h=>byHash[h]);
  if(raw.length > MAX_SIZE) {
    raw.sort((a,b)=>{
      return a.blockNumber - b.blockNumber;
    });
    let diff = raw.length-MAX_SIZE;
    for(let i=0;i<diff;++i) {
      let rem = raw[i];
      delete byHash[rem.challengeHash];
    }
  }
  let cHash = action.currentHash;
  
  return {
    ...state,
    loading: false,
    byHash,
    currentChallenge: cHash?cHash.toLowerCase():null
  }
}


const add = (state=INIT, action) => {
  let byHash = {
    ...state.byHash
  };
  let chals = action.challenges || [];
  chals.forEach(c=>{
    byHash[c.challengeHash] = c;
  });
  let raw = Object.keys(byHash).map(h=>byHash[h]);
  if(raw.length > MAX_SIZE) {
    raw.sort((a,b)=>{
      return a.blockNumber - b.blockNumber;
    });
    let diff = raw.length-MAX_SIZE;
    for(let i=0;i<diff;++i) {
      let rem = raw[i];
      delete byHash[rem.challengeHash];
    }
  }
  let cHash = action.currentHash;
  
  return {
    ...state,
    byHash,
    currentChallenge: cHash?cHash.toLowerCase():null
  }
}

const current = (state=INIT, action) => {
  if(!action.hash) {
    return {
      ...state,
      currentChallenge: null
    }
  }

  return {
    ...state,
    currentChallenge: action.hash?action.hash.toLowerCase():null
  }
}


const update = (state=INIT, action) => {
  let byHash = {
    ...state.byHash
  };
  let chals = action.challenges || [];
  chals.forEach(c=>{
    byHash[c.challengeHash] = c;
  });
  let raw = Object.keys(byHash).map(h=>byHash[h]);
  if(raw.length > MAX_SIZE) {
    raw.sort((a,b)=>{
      return a.blockNumber - b.blockNumber;
    });
    let diff = raw.length-MAX_SIZE;
    for(let i=0;i<diff;++i) {
      let rem = raw[i];
      delete byHash[rem.challengeHash];
    }
  }
  return {
    ...state,
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
  [Types.ADD_CHALLENGES]: add,
  [Types.SET_CURRENT]: current,
  [Types.UPDATE_CHALLENGES]: update,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
