import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {Creators} from '../actions';
import _ from 'lodash';

const normalizeValue = (val) => {
  let toJS = val.toJSON;
  if(!toJS) {
    toJS = () => val
  }
  return {
    ...val,
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
      database: dbNames.NewValue,
      selector: {
        challengeHash: ch.challengeHash
      },
      limit: 1
    });
    if(!r || r.length === 0) {
      continue;
    }
    for(let j=0;j<r.length;++j) {
      restored.push(normalizeValue(r[j]));
    }
  }

  return restored.reduce((o,v)=>{
    o[v.challengeHash] = v;
    return o;
  },{});
}

export default {
  loadAll
}
