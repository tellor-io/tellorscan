import {createReducer} from 'reduxsauce';
import {Types} from './actions';
import _ from 'lodash';
import * as util from 'web3-utils';
import {updateReward} from 'Utils/token';

const INIT = {
  loading: false,
  error: null,
  topMiners: {}
}

const start = (state=INIT) => {
  return {
    ...state,
    loading: true,
    error: null
  }
}

const success = (state=INIT, action) => {
  let data = action.data;
  return {
    ...state,
    loading: false,
    topMiners: data
  }
}

const update = (state=INIT, action) => {
  let challenge = action.data;
  let tops = {
    ...state.topMiners
  }
  if(!challenge.finalValue) {
    return state;
  }
  _.values(challenge.nonces).forEach(n=>{
    if(n.winningOrder >= 0) {
      let m = tops[n.miner] || {
        balance: util.toBN("0"),
        lastMineTime: 0,
        address: n.miner
      };
      m.balance = updateReward(m.balance, n.winningOrder);
      m.lastMineTime = challenge.finalValue.mineTime;
      tops[n.miner] = m;
    }
  });

  return {
    ...state,
    topMiners: tops
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const HANDLERS = {
  [Types.INIT_START]: start,
  [Types.INIT_SUCCESS]: success,
  [Types.FAILURE]: fail,
  [Types.UPDATE]: update
}

export default createReducer(INIT, HANDLERS);
