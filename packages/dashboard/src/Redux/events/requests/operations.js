import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';
import _ from 'lodash';
import {empty} from 'Utils/strings';

const incomingEvent = async (dispatch, getState, evt) => {
  await Storage.instance.create({
    database: dbNames.DataRequested,
    data: evt.toJSON()
  });

  dispatch(Creators.addEvent(evt.normalize()));
}

const init = () => async (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  dispatch(Creators.initStart());

  //subscribe to new events
  con.events.DataRequested(null, (e, evt)=>{
    if(evt) {
      console.log("requests.operations Received data request event", evt);
      incomingEvent(dispatch, getState, evt);
    }
  });

  //read all current events
  let r = await Storage.instance.read({
    database: dbNames.DataRequested,
    limit: 50,
    order: [{
      field: 'blockNumber',
      direction: 'desc'
    }]
  });
  let events = _.get(r, "data", []);
  dispatch(Creators.initSuccess(events.map(e=>eventFactory(e).normalize())));
}

const lookup = id => async (dispatch,getState) => {
  //first, see if we have it in memory
  let state = getState();
  let byId = state.events.requests.byId;
  let req = byId[id];
  if(req) {
    return req;
  }
  //see if storage has it
  let r = await Storage.instance.read({
    database: dbNames.DataRequested,
    key: id
  });
  let q = _.get(r, "data", [])[0];
  if(q) {
    return q;
  }
  //finally go on chain and get it
  let con = getState().chain.contract;
  let vars = await con.getApiVars(id);
  //order is queryString, queryHash,_granularity, paypool index, tip
  if(!empty(vars[0])) {
    
    let payload = {
      event: "DataRequested",
      returnValues: {
        sender: "from_contract",
        _sapi: vars[0],
        _granularity: vars[2],
        _apiId: id,
        _value: vars[4]
      }
    };

    let evt = eventFactory(payload);
    //store it for local retrieval next time
    await Storage.instance.create({
      database: dbNames.DataRequested,
      key: id,
      data: evt.toJSON()
    });

    return evt.normalize();
  }

  //not found
  return null;
}

export default {
  init,
  lookup
}
