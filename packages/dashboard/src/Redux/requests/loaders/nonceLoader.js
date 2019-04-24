import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {Creators} from '../actions';
import _ from 'lodash';

const normalizeNonce = n => {
  let toJS = n.toJSON;
  if(!toJS) {
    toJS = () => n
  }
  return {
    ...n,
    winningOrder: n.winningOrder<0?-1:n.winningOrder,
    toJSON: toJS
  }
}

const loadAll = (chByHash) => async (dispatch, getState) => {

  //we need load specific nonces for given hashes
  let challenges = _.values(chByHash);
  let restored = [];

  for(let i=0;i<challenges.length;++i) {
    let ch = challenges[i];
    let r = await Storage.instance.find({
      database: dbNames.NonceSubmitted,
      selector: {
        challengeHash: ch.challengeHash
      },
      limit: 5
    });
    if(!r || r.length === 0) {
      continue;
    }
    for(let j=0;j<r.length;++j) {
      restored.push(normalizeNonce(r[j]));
    }
  }

  return restored.reduce((o,n)=>{
    let byMiner = o[n.challengeHash] || {};
    byMiner[n.miner] = n;
    o[n.challengeHash] = byMiner;
    return o;
  },{});
}

export default {
  loadAll
}
