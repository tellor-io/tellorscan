import {Creators} from './actions';
import Request from './model/Request';
import Challenge from './model/Challenge';
import Dispute from './model/Dispute';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';
import {empty} from 'Utils/strings';
import {registerDeps} from 'Redux/DepMiddleware';
import {Types as settingsTypes} from 'Redux/settings/actions';

const normalizeEvent = (evt) => (dispatch,getState) => {

  let norm = evt;
  if(evt.normalize) {
    norm = evt.normalize();
  }
  if(!norm.id) {
    return norm;
  }

  let st = getState();
  let byId = st.events.tree.byId;
  let q = byId[evt._apiId];
  if(!q) {
    q = byId[evt.id];
  }

  if(q) {
    norm = {
      ...norm,
      symbol: q.symbol
    }
  }
  return norm;
}

let subscribed = false;

const _initSubs = () => (dispatch, getState) => {
  if(subscribed) {
    return;
  }

  let con = getState().chain.contract;

  //subscribe to incoming events
  con.events.allEvents(null, async (e, evt)=>{
    if(evt) {
      console.log("Incoming tree.operations event", evt);

      let norm = dispatch(normalizeEvent(evt));
      let tree = null;
      let reqId = norm.id;
      if(norm.name === 'NewDispute') {
        reqId = norm.requestId;
      }
      if(reqId && norm.name !== 'DataRequested') {
        let state = getState();
        tree = state.events.tree.byId[reqId];
        if(!tree) {
          //have to lookup the request and start a new root request.
          let req = await dispatch(_lookup(reqId));
          if(req) {
            tree = new Request({metadata: req});
            dispatch(Creators.addRequest(tree));
          } else {
            console.log("No request found for incoming event", norm);
          }
        }
      }

      //if(tree) {
        switch(norm.name) {
          case dbNames.DataRequested: {
            if(tree) {
              await dispatch(Creators.addRequest(tree));
            }
            break;
          }

          case dbNames.NewChallenge: {

            console.log("Getting new challenge event in tree.operations");
            await dispatch(Request.ops.challengeEvent(norm));
            break;
          }

          case dbNames.NonceSubmitted: {
            await dispatch(Challenge.ops.nonceEvent(norm));
            break;
          }

          case dbNames.NewValue: {
            await dispatch(Challenge.ops.newValueEvent(norm));
            break;
          }

          case dbNames.NewDispute: {
            console.log("Getting dispute event");
            await dispatch(Request.ops.disputeEvent(norm));
            break;
          }

          case dbNames.Voted: {
            console.log("Getting vote");
            await dispatch(Dispute.ops.voteEvent(norm));
            break;
          }

          default: {
            console.log("Not handling event", norm.name);
          }
        }
      //}
    }
  });
  subscribed = true;
}

const init = () => async (dispatch,getState) => {
  dispatch(Creators.clearAll());
  dispatch(Creators.initStart());

  let chain = getState().chain.chain;
  let con = getState().chain.contract;

  let missing = await chain.getMissingBlockRanges();
  //locally cached requests keyed by id
  let requests = await dispatch(Request.loadAll(missing));

  dispatch(_initSubs());

  dispatch(Creators.initSuccess(requests));
}

const findByRequestId = id => async (dispatch,getState) => {

  let req = await dispatch(_lookupInState(id));
  if(req) {
    return req;
  }
  req = await dispatch(_lookupInStorage(id));
  if(req) {
    req = new Request({metadata: req});
    dispatch(Creators.addRequest(req));
    return req;
  }
  req = await dispatch(_lookupOnChain(id));
  if(req) {
    req = new Request({metadata: req});
    dispatch(Creators.addRequest(req));
    return req;
  }
  return null;
}

const _lookupInState = id => async (dispatch, getState) => {
  //first, see if we have it in memory
  let state = getState();
  let byId = state.events.tree.byId;
  let req = byId[id];
  if(req) {
    //console.log("Found from redux events.tree.byId", req);
    return req;
  }
  return null;
}

const _lookupInStorage = id => async (dispatch, getState) => {
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
    //console.log("Found in DataRequested store", id, q);
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
    //console.log("Found in RequestMetadata store", id, q);
    return q;
  }
  return null;
}

const _lookupOnChain = id => async (dispatch, getState) => {
  //finally go on chain and get it
  let con = getState().chain.contract;
  if(!con) {
    return null;
  }

  let vars = await con.getRequestVars(id);
  console.log("Vars", vars);

  //order is queryString, symbol, queryHash,_granularity, paypool index, tip
  if(!empty(vars[0])) {

    let payload = {
      event: "DataRequested",
      returnValues: {
        sender: "from_contract",
        _query: vars[0],
        _querySymbol: vars[1],
        _granularity: vars[3],
        _requestId: id,
        _totalTips: vars[5]
      }
    };

    let hash = vars[2];

    let evt = eventFactory(payload);
    //console.log("Retrieved from on-chain", hash, evt.normalize());

    //store it for local retrieval next time
    await Storage.instance.create({
      database: dbNames.RequestMetadata,
      key: hash,
      data: evt.toJSON()
    });

    return evt.normalize();
  }
  return null;
}

const _lookup = id => async (dispatch,getState) => {
  //first, see if we have it in memory
  let req = await dispatch(_lookupInState(id));
  if(req) {
    return req;
  }

  //did we store it?
  req = await dispatch(_lookupInStorage(id));
  if(req) {
    return req;
  }

  //can we find it on-chain?
  return dispatch(_lookupOnChain(id));
}

export default {
  init,
  findByRequestId
}
