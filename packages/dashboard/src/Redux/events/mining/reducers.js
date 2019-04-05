import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  submissionsById: {},
  valuesById: {}
}

const sortByBlock = items => {
  items.sort((a,b)=>{
    if(a.blockNumber > b.blockNumber) {
      return -1; //descending so it comes first
    } else if(a.blockNumber < b.blockNumber) {
      return 1;
    }
    return 0;
  });
}

const initStart = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const initSuccess = (state=INIT, action) => {
  let nonces = action.nonces || [];
  let values = action.values || [];
  let subsById = {
    ...state.submissionsById
  };
  let valsById = {
    ...state.valuesById
  }
  nonces.forEach(n=>{
    let subs = subsById[n.id] || [];
    subs = [
      ...subs,
      n
    ];
    sortByBlock(subs);
    subsById[n.id] = subs;
  });

  values.forEach(v=>{
    let subs = valsById[v.id] || [];
    subs = [
      ...subs,
      v
    ];
    sortByBlock(subs);
    valsById[v.id] = subs;
  });
  return {
    ...state,
    loading: false,
    submissionsById: subsById,
    valuesById: valsById
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
  let evt = action.event;
  
  if(evt.name === 'NonceSubmitted') {
    let subs = state.submissionsById[evt.id] || [];
    subs = [
      ...subs,
      evt
    ];
    sortByBlock(subs);
    let byId = {
      ...state.submissionsById,
      [evt.id]: subs
    };
    return {
      ...state,
      submissionsById: byId
    }
  } else if(evt.name === 'NewValue') {
    let subs = state.valuesById[evt.id] || [];
    subs = [
      ...subs,
      evt
    ];
    sortByBlock(subs);
    let byId = {
      ...state.valuesById,
      [evt.id]: subs
    };
    return {
      ...state,
      valuesById: byId
    }
  }

  return state;
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_EVENT]: addEvent
}

export default createReducer(INIT, HANDLERS);
