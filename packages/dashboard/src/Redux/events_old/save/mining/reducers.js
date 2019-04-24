import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  events: []
}

const sortByBlock = items => {
  items.sort((a,b)=>{
    if(a.blockNumber > b.blockNumber) {
      return -1; //descending so it comes first
    }
    if(a.blockNumber < b.blockNumber) {
      return 1;
    }
    if(isNaN(a.logIndex) || isNaN(b.logIndex)) {
      return 0;
    }
    return a.logIndex < b.logIndex;
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
  let events = action.events;
  if(!events) {
    return {
      ...state,
      loading: false
    }
  }

  return {
    ...state,
    loading: false,
    events: action.events
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const MAX_SIZE = 50;
const addEvent = (state=INIT, action) => {
  let evt = action.event;
  let events = [
    ...state.events,
    evt
  ];
  sortByBlock(events);
  if(events.length > MAX_SIZE) {
    events = events.slice(0, MAX_SIZE);
  }

  return {
    ...state,
    events
  }
}



const clear = (state=INIT) => {
  return {
    ...state,
    events: []
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
