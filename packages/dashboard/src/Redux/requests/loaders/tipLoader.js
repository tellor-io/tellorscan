import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';
import {Creators} from '../actions';
import _ from 'lodash';

const normalizeTip = (req,tip) => {
  let toJS = tip.toJSON;
  if(!toJS) {
    toJS = () => req
  };
  return {
    ...tip,
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
      database: dbNames.TipAdded,
      selector: {
        id: req.id
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
      let t = normalizeTip(reqMap[r[j].id],r[j]);
      restored.push(t);
    }
  }

  let byId = restored.reduce((o,dr)=>{
    let a = o[dr.id] || [];
    a.push(dr);
    o[dr.id] = a;
    return o;
  },{});

  return byId;
}

export default {
  loadAll
}
