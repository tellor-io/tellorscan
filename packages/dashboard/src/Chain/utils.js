import * as ethUtils from 'web3-utils';
import eventFactory from 'Chain/LogEvents/EventFactory';
import {empty} from 'Utils/strings';
import _ from 'lodash';
import {Logger} from 'buidl-utils';

const log = new Logger({component: "ChainUtils"});
const psr = require('./psr.json');

export const generateQueryHash = (queryString, multi) => {
  return ethUtils.soliditySha3({t:'string',v:queryString},{t:'uint256',v:multi})
}

export const generateDisputeHash = ({requestId, miner, timestamp}) => {
  return ethUtils.soliditySha3({t: 'address', v:miner},{t:'uint256',v:requestId},{t:'uint256',v:timestamp});
}

export const getCurrentChallenge = () => async (dispatch, getState) => {
  let con = getState().chain.contract;
  if(!con) {
    return null;
  }
  //current challenge, curretnRequestId, level of difficulty, api/query string, and granularity(number of decimals requested), total tip for the request 
  log.info("Getting current challenge variables...");
  let vars = await con.getCurrentVariables();
  let reqId = vars[1].toString(10)-0;
  if(reqId === 0) {
    return null;
  }

  let newQuery = vars[3];
  if(reqId <= 50){
    log.info("Current challenge is a PSR:", reqId);
    let req = psr.prespecifiedRequests[reqId-1];
    if(req) {
      if(!newQuery || newQuery.length === 0) {
        log.info("Using query string", req.apis[0], "for new challenge");
        newQuery = req.apis[0];
      }
    } else {
      newQuery = "Unspecified Query";
    }
  }


  if(!empty(vars[1])) {
    let payload = {
      event: "NewChallenge",
      blockNumber: 0, //will eventually get replaced by real event
      returnValues: {
        _currentChallenge: vars[0],
        _currentRequestId: vars[1],
        _difficulty: vars[2],
        _query: newQuery,
        _multiplier: vars[4],
        _totalTips: vars[5]
      }
    }
    log.info("Creating new challenge event with payload", payload);
    return eventFactory(payload);
  }
  return null;
}

export const findRequestById = (id, con) => async (dispatch, getState) => {
  if(!con) {
    con = getState().chain.contract;
  }
  if(!con) {
    log.info("No contract established yet, so can't lookup request on-chain");
    return null;
  }

  let vars = await con.getRequestVars(id);

  let newSymbol = vars[1]
  let newQuery = vars[0];
  if(id <= 50){
    let req = psr.prespecifiedRequests[id-1];
    if(req) {
      log.info("Found PSR request with id", id);
      newSymbol = req.symbol;
      if(!newQuery || newQuery.length === 0) {
        newQuery = req.apis[0];
      }
    } else {
      log.warn("PSR request did not resolve with id", id);
      newSymbol = "Unspecified PSR";
      newQuery = "Unspecified Query";
    }
  }

  //queryString,dataSymbol,queryHash, granularity,requestQPosition,totalTip
  //const {sender, _query, _querySymbol, _granularity,  _requestId,  _totalTips} = props.returnValues;


  //order is queryString, symbol, queryHash,_granularity, paypool index, tip
  if(!empty(newQuery)) {

    let payload = {
      event: "DataRequested",
      returnValues: {
        sender: "from_contract",
        _query: newQuery,
        _querySymbol: newSymbol,
        _granularity: vars[3],
        _requestId: id,
        _totalTips: vars[5]
      }
    };
    let e = eventFactory(payload);
    return e;
  }
  return null;
}

export const getCurrentTipForRequest = id => async (dispatch, getState) => {
  let con = getState().chain.contract;
  if(!con) {
    return 0;
  }
  let vals = await con.getRequestVars(id);
  if(!vals) {
    vals = [];
  }

  let v = vals[5] || 0;
  if(v.toString) {
    v = v.toString()-0;
  }
  return v;
}

export const findDisputedNonce = (req, disp) => async (dispatch, getState) => {
  //NOTE: this assumes no two challengs were mined in the same minute block. Because
  //timestamp are normalized to 1min blocks on chain
  let challenges = _.values(req.challenges);
  for(let i=0;i<challenges.length;++i) {
    let ch = challenges[i];
    if(typeof ch.finalValue !== 'object') {
      continue;
    }

    if(ch.finalValue.mineTime !== disp.mineTime) {
      continue;
    }
    let nonces = _.values(ch.nonces);
    let match = nonces.filter(n=>n.miner === disp.miner)[0];
    if(match) {
      return match;
    }
  }
  return null;
}

export const findDisputeById = (id, con) => async (dispathc, getState) => {
  if(!con) {
    con = getState().chain.contract;
    if(!con) {
      return null;
    }
  }

  let disp = await con.getDisputeDetails(id);
  if(disp) {
    let payload = {
      event: "NewDispute",
      blockNumber: 0,
      logIndex: 0,
      timestamp: disp._timestamp,
      returnValues: disp
    };
    return eventFactory(payload);
  }
  return null;
}

export const getMiningOrder = (newVal,con) =>  async (dispatch, getState) => {
  
  if(!con) {
    con = getState().chain.contract;
    if(!con) {
      return null;
    }
  }
  if(typeof newVal.normalize === 'function') {
    newVal = newVal.normalize();
  }
  
  //call on-chain to get miners by mining time and request id
  let miners = await con.getMinersByRequestIdAndTimestamp(newVal.id, newVal.mineTime);

  //make sure miner addresses are lower case for comparisons
  return miners.map(m=>m.toLowerCase());
}


const sameMiner = (a, b) => {
  return a.miner.toLowerCase() === b.miner.toLowerCase()
}

export const dedupeNonces = nonces => {
  let byMiner = {};
  nonces.forEach(n=>byMiner[n.miner.toLowerCase()]=n);
  return _.keys(byMiner).map(m=>byMiner[m]);
}
