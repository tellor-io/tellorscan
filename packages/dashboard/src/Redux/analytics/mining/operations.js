import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import * as util from 'web3-utils';
import {updateReward} from 'Utils/token';

const findFinalValue = (n) => async (dispatch, getState) => {
  let r = await Storage.instance.find({
    database: dbNames.NewValue,
    selector: {
      challengeHash: n.challengeHash
    },
    limit: 1
  });
  return r[0];
}

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  let r = await Storage.instance.readAll({
    database: dbNames.NonceSubmitted,
    limit: 50,
    filterFn: (v, k, itNum) => {
      return v.winningOrder >= 0
    },
    sort: [
      {
        field: "blockNumber",
        order: 'desc'
      }
    ]
  });

  let tops = {};
  for(let i=0;i<r.length;++i) {
    let n = r[i];
    let val = await dispatch(findFinalValue(n));
    if(val) {
      let m = tops[n.miner] || {
        balance: util.toBN("0"),
        address: n.miner,
        lastMineTime: val.mineTime
      }
      m.balance = updateReward(m.balance, n.winningOrder);
      if(val.mineTime > m.lastMineTime) {
        m.lastMineTime = val.mineTime;
      }
      tops[n.miner] = m;
    }
  }
  dispatch(Creators.initSuccess(tops));
}

const update = (ch) => (dispatch) => {
  dispatch(Creators.update(ch));
}

export default {
  init,
  update
}
