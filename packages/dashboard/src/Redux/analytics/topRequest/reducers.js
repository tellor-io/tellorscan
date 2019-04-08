import {createReducer} from 'reduxsauce';
import {Types} from './actions';
import _ from 'lodash';

const INIT = {
  loading: false,
  error: null,
  runningCounts: {},
  top: null
}

const initStart = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const initDone = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    runningCounts: action.counts || {},
    top: action.top
  }
}

const updateStart = (state=INIT) => {
  return {
    ...state,
    loading: true
  }
}

const update = (state=INIT, action) => {
  let evt = action.event;
  let ex = state.runningCounts[evt.id]

  if(!ex) {
    ex = {
      ...evt,
      count: 0
    }
  } else {
    ex = {
      ...ex
    }
  }
  ex.count++;
  let events = {
    ...state.runningCounts,
    [evt.id]: ex
  };
  let all = _.values(events);
  all.sort((a,b)=>{
    return b.count - a.count;
  });

  let top =null;
  if(all[0]) {
    top = {
      id: all[0].id,
      count: all[0].count
    }
  }

  return {
    ...state,
    loading: false,
    runningCounts: events,
    top
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
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initDone,
  [Types.FAILURE]: fail,
  [Types.UPDATE_START]: updateStart,
  [Types.UPDATE_SUCCESS]: update
}

export default createReducer(INIT, HANDLERS);
