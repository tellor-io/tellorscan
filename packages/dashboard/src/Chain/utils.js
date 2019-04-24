import * as ethUtils from 'web3-utils';
import eventFactory from 'Chain/LogEvents/EventFactory';
import {empty} from 'Utils/strings';
import _ from 'lodash';

export const generateQueryHash = (queryString, multi) => {
  return ethUtils.soliditySha3({t:'string',v:queryString},{t:'uint256',v:multi})
}

export const generateDisputeHash = ({requestId, miner, timestamp}) => {
  return ethUtils.soliditySha3({t: 'address', v:miner},{t:'uint256',v:requestId},{t:'uint256',v:timestamp});
}

export const findRequestById = id => async (dispatch, getState) => {
  let con = getState().chain.contract;
  if(!con) {
    return null;
  }

  let vars = await con.getRequestVars(id);

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
    return eventFactory(payload);
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
