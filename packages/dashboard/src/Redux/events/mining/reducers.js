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
  if(!action.nonces) {
    return {
      ...state,
      loading: false
    }
  }

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
  let nm = evt.name || evt.event;

  if(nm === 'NonceSubmitted') {
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
  } else if(nm === 'NewValue') {
    if(!evt.type) {
      evt.type = "New Value";
    }
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

const clear = (state=INIT) => {
  return {
    ...state,
    submissionsById: {},
    valuesById: {}
  }
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_EVENT]: addEvent,
  [Types.CLEAR_ALL]: clear
}

export default createReducer(INIT, HANDLERS);
