import {Types} from './actions';
import {createReducer} from 'reduxsauce';


const MAX_IN_Q = 50; //contract only keeps 50 items in payout pool

const INIT = {
  loading: false,
  error: null,
  queries: [],
  byId: {},
  selectedQuery: null
}

const sortByTip = items => {
  items.sort((a,b)=>{
    a.tip -= 0;
    b.tip -= 0;
    if(a.tip > b.tip) {
      return -1; //descending so it comes first
    }
    if(a.tip > b.tip) {
      return 1;
    }
    return 0;
  });
}

const loadReq = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const loadSuccess = (state=INIT, action) => {
  let qs = action.data;
  sortByTip(qs);
  if(qs.length > MAX_IN_Q) {
    qs = qs.slice(0, MAX_IN_Q);
  }

  return {
    loading: false,
    queries: qs,
    byId: qs.reduce((o,q)=>{
      o[q.id] = q;
      return o
    },{})
  }
}

const add = (state=INIT, action) => {
  let qs = [...state.queries, action.data];
  //sort by tip
  sortByTip(qs);
  if(qs.length > MAX_IN_Q) {
    qs = qs.slice(1, MAX_IN_Q);
  }

  let byId = qs.reduce((o,q)=>{
    o[q.id] = q;
    return o;
  },{});

  return {
    ...state,
    queries: qs,
    byId
  }
}

const selectQuery = (state=INIT, action) => {
  return {
    ...state,
    selectedQuery: action.query
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
  [Types.LOAD_REQUEST]: loadReq,
  [Types.LOAD_SUCCESS]: loadSuccess,
  [Types.FAILURE]: fail,
  [Types.SELECT_QUERY]: selectQuery,
  [Types.ADD_EVENT]: add
}

export default createReducer(INIT, HANDLERS);
