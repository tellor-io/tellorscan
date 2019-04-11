import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';

import {registerDeps} from 'Redux/DepMiddleware';
import {Types as settingsTypes} from 'Redux/settings/actions';

const normalizeEvent = (evt) => (dispatch,getState) => {
  let st = getState();
  let byId = st.events.requests.byId;
  let q = byId[evt._apiId];
  if(!q) {
    q = byId[evt.id];
  }
  let norm = evt;
  if(evt.normalize) {
    norm = evt.normalize();
  }
  if(q) {
    norm = {
      ...norm,
      symbol: q.symbol
    }
  } else {
    console.log("Attempting to normalize event without ref request", evt);
  }
  return norm;
}

const incomingEvent = (dispatch, getState, evt) => {
  let norm = dispatch(normalizeEvent(evt));
  dispatch(Creators.addEvent(norm));
}

const MAX_SIZE = 50;
const init = () => async (dispatch,getState) => {

  registerDeps([settingsTypes.CLEAR_HISTORY_SUCCESS], async () => {
    dispatch(Creators.initStart());
    dispatch(Creators.clearAll());
    dispatch(Creators.initSuccess());
  });

  let state = getState();
  let con = state.chain.contract;
  dispatch(Creators.initStart());

  //subscribe to new events
  con.events.NonceSubmitted(null, (e, evt)=>{
    if(evt) {
      incomingEvent(dispatch, getState, evt);
    }
  });
  con.events.NewValue(null, (e, evt)=>{
    if(evt) {
      incomingEvent(dispatch, getState, evt);
    }
  })

  //read all current events
  let r = await Storage.instance.readAll({
    database: dbNames.NonceSubmitted,
    limit: 50,
    order: [{
      field: 'blockNumber',
      direction: 'desc'
    }]
  });

  let nonces = r || [];

  r = await Storage.instance.readAll({
    database: dbNames.NewValue,
    limit: 50,
    order: [{
      field: 'blockNumber',
      direction: 'desc'
    }]
  });
  let values = r || [];
  let sortFn = (a,b)=>{
    if(a.blockNumber > b.blockNumber) {
      return -1; //descending order
    }
    if(a.blockNumber < b.blockNumber) {
      return 1
    }
    if(a.logIndex > b.logIndex) {
      return 1;
    }
    if(a.logIndex < b.logIndex) {
      return -1;
    }
    if(a.id > b.id) {
      return 1;
    }
    if(a.id < b.id) {
      return -1;
    }
    return 0;
  };
  let merged = [
    ...nonces,
    ...values
  ]
  merged.sort(sortFn);
  if(merged.length > MAX_SIZE) {
    merged = merged.slice(0, MAX_SIZE);
  }
  merged = merged.map(e=>dispatch(normalizeEvent(e)));

  dispatch(Creators.initSuccess(merged));
}

export default {
  init
}
