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

const BUCKET_SIZE = 10; //tips per bucket
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
  /*
  let buckets = [
    ...state.data
  ];
  let evt = action.event;
  //get last bucket, which should be most recent in time order
  let last = buckets[buckets.length-1] || {
    count: 0,
    tipTotal: 0,
    timestamp: evt.timestamp
  };

  if(last.count === BUCKET_SIZE) {
    last = {
      count: 0,
      tipTotal: 0,
      timestamp: evt.timestamp
    };
    buckets.push(last);
  } else {
    //deep copy to avoid weird UI updates
    last = {
      ...last
    };
    buckets[buckets.length-1] = last;
  }
  last.count++;
  last.tipTotal += evt.tip;

  return {
    ...state,
    data: buckets
  }
  */
}

const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.UPDATE]: update,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
