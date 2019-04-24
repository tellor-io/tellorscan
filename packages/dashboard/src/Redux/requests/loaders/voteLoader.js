import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';
import {Creators} from '../actions';
import _ from 'lodash';

const normalizeVote = (vote) => {
  let toJS = vote.toJSON;
  if(!toJS) {
    toJS = () => vote
  };
  return {
    ...vote,
    toJSON: toJS
  }
}

const loadAll = (dispMap) => async (dispatch, getState) => {
  //have to read specific challenges for every request in the map
  let disputes = _.values(dispMap);
  let restored = [];

  for(let i=0;i<disputes.length;++i) {
    let d = disputes[i];

    let r = await Storage.instance.readAll({
      database: dbNames.Voted,
      selector: {
        id: d.id
      },
      sort: [
        {
          field: "blockNumber",
          order: "DESC"
        }
      ],
      limit: 10
    });
    if(!r || r.length === 0) {
      continue;
    }
    for(let j=0;j<r.length;++j) {
      let v = normalizeVote(r[j]);
      restored.push(v);
    }
  }

  let byId = restored.reduce((o,v)=>{
    let a = o[v.id] || [];
    a.push(v);
    o[v.id] = a;
    return o;
  },{});

  return byId;
}

export default {
  loadAll
}
