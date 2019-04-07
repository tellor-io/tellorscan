import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';
import _ from 'lodash';
import {empty} from 'Utils/strings';

const getCurrentTip = id => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  let vals = await con.getApiVars(id);
  return vals[4] || 0;
}

const init = () => async (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  dispatch(Creators.initStart());

  //subscribe to new events
  con.events.DataRequested(null, async (e, evt)=>{
    if(evt) {
      console.log("requests.operations Received data request event", evt);
      //new data request. We add the event, but need to also adjust its
      //tip amount according to what's on chain (it could have initiated a
      //mining request which would zero-out its tip value);
      let tip = await dispatch(getCurrentTip(evt._apid));
      dispatch(Creators.addEvent(evt.normalize(), tip));
    }
  });

  con.events.NewChallenge(null, async (e, evt)=>{
    if(evt) {
      dispatch(Creators.updateTip(evt._miningApiId, 0));
    }
  });

  con.events.TipUpdated(null, async (e,evt)=>{
    if(evt) {

      let byId = getState().events.requests.byId;
      let ex = byId[evt._apiId];
      if(ex) {
        //We go on chain to get the current tip
        let tip = await dispatch(getCurrentTip(evt._apiId));

        dispatch(Creators.updateTip(evt._apiId, tip));
      }
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
  //see if storage has it from past events
  let r = await Storage.instance.read({
    database: dbNames.DataRequested,
    selector: {
      _apiId: id
    }
  });
  let q = _.get(r, "data", [])[0];
  if(q) {
    return q;
  }

  //see if we stored metadata from contract
  r = await Storage.instance.read({
    database: dbNames.RequestMetadata,
    key: id
  });

  q = _.get(r, "data", [])[0];
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
        _value: vars[4],
        _symbol: vars[5]
      }
    };

    let evt = eventFactory(payload);
    //store it for local retrieval next time
    await Storage.instance.create({
      database: dbNames.RequestMetadata,
      key: id,
      data: evt.normalize()
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
