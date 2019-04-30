import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';
import _ from 'lodash';
import {default as nonceOps} from './nonceLoader';
import {default as valOps} from './newValueLoader';

const normalizeChallenge = (req,ch) => {
  let miners = ch.minerOrder || [];
  let toJS = ch.toJSON;
  if(!toJS) {
    toJS = () => req
  };
  return {
    ...ch,
    symbol: req.symbol,
    nonces: {
      ...ch.nonces
    },
    finalValue: ch.finalValue?{
      ...ch.finalValue
    }:undefined,
    minerOrder: [...miners],
    toJSON: toJS
  }
}

const loadAll = (reqMap) => async (dispatch, getState) => {
  //have to read specific challenges for every request in the map
  let reqs = _.values(reqMap);
  let restored = [];

  for(let i=0;i<reqs.length;++i) {
    let req = reqs[i];

    let r = await Storage.instance.readAll({
      database: dbNames.NewChallenge,
      selector: {
        id: req.id
      },
      limit: 50
    });
    if(!r || r.length === 0) {
      continue;
    }
    for(let j=0;j<r.length;++j) {
      let ch = normalizeChallenge(reqMap[r[j].id],r[j]);
      restored.push(ch);
    }
  }

  let byId = {};
  let byHash = restored.reduce((o,dr)=>{
    o[dr.challengeHash] = dr;
    let h = byId[dr.id] || {};
    h[dr.challengeHash] = dr;
    byId[dr.id] = h;

    return o;
  },{});

  let noncesByHash = await dispatch(nonceOps.loadAll(byHash));
  let valuesByHash = await dispatch(valOps.loadAll(byHash));

  _.keys(noncesByHash).forEach(h=>{
    let byMiner = noncesByHash[h];
    let ch = byHash[h];
    let v = valuesByHash[h];
    ch = {
      ...ch,
      nonces: byMiner,
      finalValue: v
    }
    let byCHash = byId[ch.id];
    byId[ch.id] = {
      ...byCHash,
      [ch.challengeHash]: ch
    }
  });

  return byId;
}

export default {
  loadAll
}
