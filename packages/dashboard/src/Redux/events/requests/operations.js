import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';
import _ from 'lodash';
import {empty} from 'Utils/strings';
import * as ethUtils from 'web3-utils';
import {generateQueryHash} from 'Chain/utils';

import {registerDeps} from 'Redux/DepMiddleware';
import {Types as settingsTypes} from 'Redux/settings/actions';

const getCurrentTip = id => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  let vals = await con.getApiVars(id);
  return vals[4] || 0;
}

const initFromContract = () => async (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  let apiIds = await con.payoutPool();
  if(apiIds) {
    //on real Rinkeby/Mainnet, this will be slow AF. But no choice
    //since, presumably, we have no history
    apiIds.forEach(async id=>{
      let info = await dispatch(lookup(id));
      let tip = await dispatch(getCurrentTip(id));
      dispatch(Creators.addEvent(info, tip));
    });
  }
}

const init = () => async (dispatch,getState) => {

  registerDeps([settingsTypes.CLEAR_HISTORY_SUCCESS], async () => {
    dispatch(Creators.initStart());
    dispatch(Creators.clearAll());
    await dispatch(initFromContract());
    dispatch(Creators.initSuccess());
  });

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
      let state = getState();
      if(!state.events.requests.byId[evt._miningApiId]) {
        let info = await dispatch(lookup(evt._miningApiId));
        if(info) {
          let tip = await dispatch(getCurrentTip(info.id));
          dispatch(Creators.addEvent(info, tip));
        }
      }

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
      } else {
        let info = await dispatch(lookup(evt._miningApiId));
        if(info) {
          let tip = await dispatch(getCurrentTip(info.id));
          dispatch(Creators.addEvent(info, tip));
        }
      }
    }
  });

  //read all current events
  let r = await Storage.instance.readAll({
    database: dbNames.DataRequested,
    limit: 50,
    order: [{
      field: 'blockNumber',
      direction: 'desc'
    }]
  });
  let events = r || [];

  events.forEach(async e=>{
    let tip = await dispatch(getCurrentTip(e.id));
    dispatch(Creators.addEvent(e, tip));
  });

  events = await Storage.instance.readAll({
    database: dbNames.RequestMetadata,
    limit: 50
  });
  events.forEach(async e=>{
    let tip = await dispatch(getCurrentTip(e.id));
    dispatch(Creators.addEvent(e, tip));
  });

  dispatch(Creators.initSuccess());
}

const retrieveRequest = id => async (dispatch,getState) => {
  let req = await dispatch(lookup(id));
  if(req) {
    let tip = await dispatch(getCurrentTip(id));
    dispatch(Creators.addEvent(req, tip));
  }
}

const lookup = id => async (dispatch,getState) => {

  //first, see if we have it in memory
  let state = getState();
  let byId = state.events.requests.byId;
  let req = byId[id];
  if(req) {
    console.log("Found from redux events.requests.byId", req);
    return req;
  }

  //see if storage has it from past events
  let r = await Storage.instance.find({
    database: dbNames.DataRequested,
    selector: {
      id
    },
    limit: 1
  });
  let q = r[0];
  if(q) {
    console.log("Found in DataRequested store", id, q);
    return q;
  }


  //see if we stored metadata from contract
  r = await Storage.instance.find({
    database: dbNames.RequestMetadata,
    selector: {
      id
    },
    limit: 1
  });

  q = r[0];
  if(q) {
    console.log("Found in RequestMetadata store", id, q);
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

    let hash = vars[1];

    let evt = eventFactory(payload);
    console.log("Retrieved from on-chain", hash, evt.normalize());

    //store it for local retrieval next time
    await Storage.instance.create({
      database: dbNames.RequestMetadata,
      key: hash,
      data: evt.toJSON()
    });

    return evt.normalize();
  }

  //not found
  return null;
}

export default {
  init,
  lookup,
  retrieveRequest
}
