import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {default as reqOps} from 'Redux/events/requests/operations';

const init = () => async (dispatch, getState) => {
  let state = getState();

}


const search = (params) => async (dispatch,getState) => {

  let id = params.id;
  if(!id || isNaN(id)) {
    throw new Error("Invalid apiId for search");
  }
  let state = getState();

  dispatch(Creators.searchStart(id));

  let req = await dispatch(reqOps.lookup(id));
  let results = {
    total: 0,
    data: {
      metadata: {},
      events: [],
      page: 0
    }
  }
  state = getState();
  let limit = state.search.pageSize;

  if(!req) {
    dispatch(Creators.searchSuccess(results));
    return;
  }

  let all = await _doSearch({
    ...params,
    symbol: req.symbol,
    id,
    limit,
    offset: 0,
    includeTotal: true,
    sort: state.search.sort
  });

  results.total = all.valTotal; //all.nonceTotal + all.valTotal;
  results.data.metadata = req;
  results.data.events = all.values;
  dispatch(Creators.searchSuccess(results));
}

const sortData = (ar, def) => {
 ar.sort((a,b)=>{
   let fld = def.field;
   let o = def.order.toUpperCase();
   let isAsc = o === 'ASC';
   let av = a[fld];
   let bv = b[fld];
   if(av > bv) {
     return isAsc?1:-1;
   }
   if(av < bv) {
     return isAsc?-1:1;
   }
   return 0;
 })
}

const _doSearch = async params => {
  let id = params.id;
  let limit = params.limit;
  let offset = params.offset;

  let selector = {id: id-0};
  if(!params.sort) {
    params.sort = [
      {
        field: "blockNumber",
        order: "desc"
      },
      {
        field: "logIndex",
        order: "asc"
      }
    ]
  }

  let r = await Storage.instance.find({
    database: dbNames.NewValue,
    selector,
    limit,
    offset,
    includeTotal: params.includeTotal,
    sort: params.sort
  });
  let values = r.data || r || [];
  let valTotal = r.total;

  //find all associated nonces
  values.forEach(async v=>{
    selector = {
      challengeHash: v.challengeHash
    };
    r = await Storage.instance.find({
      database: dbNames.NonceSubmitted,
      selector,
      limit: limit*5,
      offset: 0,
      sort: params.sort
    });
    v.symbol = params.symbol;
    let nonces = r.data || r || [];
    params.sort.forEach(s=>sortData(nonces, s));
    v.nonces = nonces;
  });

  params.sort.forEach(s=>sortData(values, s));

  if(params.includeTotal) {
    return {
      valTotal,
      values
    }
  }
  return values;
}

const loadPage = (props) => async (dispatch, getState) => {
  dispatch(Creators.searchStart());
  let state = getState();
  let search = state.search;
  let offset = search.pageSize * props.page;
  let all = await _doSearch({
    id: props.id,
    limit: search.pageSize,
    offset,
    includeTotal: false,
    sort: search.sort
  });
  let data = {
    ...search.results.data,
    events: all,
    offset,
    page: props.page
  };
  let results = {
    ...search.results,
    data
  };
  dispatch(Creators.searchSuccess(results));
}

const nextPage = (props) => (dispatch, getState) => {
  let search = getState().search;
  let pg = search.results.data.page;
  let max = Math.ceil(search.results.total / search.pageSize);
  if(pg+1 > max) {
    return;
  }
  let id = search.results.data.metadata.id;
  return dispatch(loadPage({
    page: pg+1,
    id
  }));
}

const prevPage = props => (dispatch,getState) => {
  let pg = search.results.data.page;
  if(pg-1 < 0) {
    return;
  }
  let id = search.results.data.metadata.id;
  return dispatch(loadPage({
    page: pg-1,
    id
  }));
}

const setSort = (props) => (dispatch, getState) => {
  dispatch(Creators.setSort(props.sort));
  let search = getState().search;

  let id = search.results.data.metadata.id;
  return dispatch(loadPage({
    ...props,
    page: 0,
    id
  }));
}

const setPageSize = (size) => dispatch => {
  dispatch(Creators.setPageSize(size));
}

export default {
  setPageSize,
  setSort,
  nextPage,
  prevPage,
  search
}
