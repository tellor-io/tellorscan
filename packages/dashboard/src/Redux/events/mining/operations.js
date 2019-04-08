import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';
import _ from 'lodash';

import {registerDeps} from 'Redux/DepMiddleware';
import {Types as settingsTypes} from 'Redux/settings/actions';

const incomingEvent = async (dispatch, getState, evt) => {
  let st = getState();
  console.log("Incoming mining event", evt);
  let byId = st.events.requests.byId;
  let q = byId[evt._apiId];
  if(!q) {
    q = byId[evt.id];
  }
  console.log("Matching query", q);
  let norm = evt;
  if(evt.normalize) {
    norm = evt.normalize();
  }
  if(q) {
    norm = {
      ...norm,
      symbol: q.symbol
    }
  }
  dispatch(Creators.addEvent(norm));
}

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

  let events = r || [];

  r = await Storage.instance.readAll({
    database: dbNames.NewValue,
    limit: 50,
    order: [{
      field: 'blockNumber',
      direction: 'desc'
    }]
  });
  r = r || [];
  events = [
    ...events,
    ...r
  ];
  events.sort((a,b)=>{
    if(a.blockNumber > b.blockNumber) {
      return 1;
    }
    if(a.blockNumber < b.blockNumber) {
      return -1
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
  });
  events.forEach(e=>{
    incomingEvent(dispatch, getState, e)
  });
}

export default {
  init
}
