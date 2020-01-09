import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  byId: {},
  byHash: {}
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
  let byHash = {};
  action.disputes.forEach(d=>{
    byId[d.id] = d;
    byHash[d.disputeHash] = d;
  })
  return {
    ...state,
    loading: false,
    byId,
    byHash
  }
}

const update = (state=INIT, action) => {
  let d = action.dispute;
  let byId = {
    ...state.byId,
    [d.id]: d
  };

  let byHash = {
    ...state.byHash,
    [d.disputeHash]: d
  };
  return {
    ...state,
    byId,
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

const select = (state=INIT, action) => {
  return {
    ...state,
    selectedChallenge: action.challenge,
    selectedNonce: action.nonce
  }
}

const add = (state=INIT, action) => {
  let byId = {
    ...state.byId
  };
  let byHash = {
    ...state.byHash
  };
  action.disputes.forEach(d=>{
    byId[d.id] = d;
    byHash[d.disputeHash] = d;
  });
  
  return {
    ...state,
    byId,
    byHash
  }

}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_DISPUTES]: add,
  [Types.UPDATE]: update,
  [Types.SELECT_FOR_DISPUTE]: select
}

export default createReducer(INIT, HANDLERS);
