import Plugin from './Plugin';
import * as dbNames from 'Storage/DBNames';
import {findRequestById, getCurrentTipForRequest} from 'Chain/utils';
import * as ethUtils from 'web3-utils';
import {Creators} from 'Redux/requests/actions';
import {default as miningOps} from 'Redux/analytics/mining/operations';

import _ from 'lodash';
import {
  normalizeRequest,
  normalizeChallenge
}  from './utils';

const getMiningOrder = newVal => async (dispatch, getState) => {
  let con = getState().chain.contract;
  if(!con) {
    return null;
  }
  newVal = newVal.normalize();
  let miners = await con.getMinersByRequestIdAndTimestamp(newVal.id, newVal.mineTime);
  return miners.map(m=>m.toLowerCase());
}

const findRequest = ({txn, store, id}) => async (dispatch, getState) => {
  let byId = getState().requests.byId;
  let req = byId[id];
  if(!req) {
    req = await dispatch(findRequestById(id));
    if(req) {
      //setup for downstream storage
      store({database: dbNames.DataRequested,
        key: ""+req.id,
        data: req.toJSON()
      });
      req = normalizeRequest(req);
    }
  }
  return req;
}

const handleNonces = ({txn, store, outData}) => async (dispatch, getState) => {
  let nonces = txn.logEventMap[dbNames.NonceSubmitted];
  if(!nonces) {
    return;
  }
  if(!Array.isArray(nonces)) {
    let a = [nonces];
    nonces = a;
  }
  if(nonces.length === 0){
    return;
  }
  //first merge nonces with current mappings
  let req = await dispatch(findRequest({id: nonces[0].id, txn, store}));
  if(!req) {
    return;
  }
  let ch = req.challenges[nonces[0].challengeHash];
  if(!ch) {

    //there is no way to resolve the challenge if we don't know about it.
    //so we have to fabricate one.
    ch = {
      blockNumber: txn.blockNumber-1,//fake it out
      timestamp: txn.timestamp,
      finalValue: null,
      nonces: {},
      minerOrder: [],
      multiplier: req.multiplier,
      id: req.id,
      queryString: req.queryString,
      difficulty: 0,
      tip: 0,
      name: "NewChallenge"
    };
    store({database: dbNames.NewChallenge,
      key: ch.challengeHash,
      data: ch
    });
  }
  ch = {
    ...ch,
    nonces: {
      ...ch.nonces,
      ...nonces.reduce((o,n)=>{
        o[n.miner] = n;
        return o;
      },{})
    }
  };
  nonces.forEach(n=>{
    store({
      database: dbNames.NonceSubmitted,
      key: ethUtils.sha3(n.challengeHash + n.miner),
      data: n.toJSON()
    });
  });

  outData.challenge = ch;
  outData.request = {
    ...req,
    challenges: {
      ...req.challenges,
      [ch.challengeHash]: ch
    }
  };
}

const changeNonceOrder = ({txn, store, prevData, outData}) => async (dispatch, getState) => {
  let challenge = prevData.challenge;
  let newVal = txn.logEventMap[dbNames.NewValue];
  if(!newVal) {
    return;
  }
  store({
    database: dbNames.NewValue,
    key: newVal.challengeHash,
    data: newVal.toJSON()
  });


  let miners = await dispatch(getMiningOrder(newVal));
  if(miners && miners.length > 0) {
    let lastKey = null;
    let lastMiner = null;
    let lastHash = null;
    let updated = _.values(challenge.nonces).map(n=>{
      let idx = miners.indexOf(n.miner);
      n.winningOrder = idx;
      let key = ethUtils.sha3(n.challengeHash + n.miner);
      if(key === lastKey) {
        console.log("Key conflict", n.challengeHash, lastHash, n.miner, lastMiner);
      }
      lastMiner = n.miner;
      lastHash = n.challengeHash;
      lastKey = key;
      store({database: dbNames.NonceSubmitted,
          key,
          data: {
            ...n.toJSON(),
            winningOrder: idx
          }
      });
      return n;
    });
    outData.miners = miners;
    outData.challenge = {
      ...challenge,
      minerOrder: miners,
      finalValue: newVal,
      nonces: updated.reduce((o,n)=>{
        o[n.miner] = n;
        return o;
      },{})
    }
    dispatch(miningOps.update(outData.challenge));
  }
}

const addNewChallenge = ({txn, store, outData}) => async (dispatch, getState) => {
  let ch = txn.logEventMap[dbNames.NewChallenge];
  if(!ch) {
    return;
  }
  let req = getState().requests.byId[ch.id];
  if(!req) {
    req = await dispatch(findRequest({txn, store, id: ch.id}));
    if(!req) {
      return;
    }
  }

  ch = normalizeChallenge(req, ch);
  outData.request = {
    ...req,
    currentTip: 0, //because any new challenge resets its tip
    challenges: {
      ...req.challenges,
      [ch.challengeHash]: ch
    }
  }
  store({database: dbNames.NewChallenge,
      key: ch.challengeHash,
      data: ch.toJSON()
  });
  outData.challenge = ch;
}

export default class MiningSolutionHandler extends Plugin {
  constructor(props) {
    super({
      ...props,
      id: "MiningSolutionHandler",
      fnContexts: ['submitMiningSolution']
    });
    [
      'process'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  process(txn, store) {
    return async (dispatch, getState) => {
      //get associated challenge
      let state = getState();
      //we have to update nonces for current challenge if availabe.

      let outData = {};
      await dispatch(handleNonces({txn, store, outData}));

      //then update nonce order if final value given
      let outOrdered = {};
      await dispatch(changeNonceOrder({txn, store, prevData: outData, outData: outOrdered}));
      if(outOrdered.challenge) {
        let req = outData.request;
        req = {
          ...req,
          challenges: {
            ...req.challenges,
            [outOrdered.challenge.challengeHash]: outOrdered.challenge
          }
        }
        outData.request = req;
      }

      //at this point we can safely update redux with previous stuff
      dispatch(Creators.updateRequest({request: outData.request}));

      //then create new challenge if present in txn
      let outNew = {};
      await dispatch(addNewChallenge({txn, store, outPrev: outData, outData: outNew}));
      if(outNew.challenge) {
        dispatch(Creators.updateRequest({request: outNew.request}));
        dispatch(Creators.updateCurrent({challenge: outNew.challenge}));
      }
    }
  }
}
