import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';
import _ from 'lodash';
import {default as voteOps} from './voteLoader';
import {findDisputedNonce} from 'Chain/utils';



const normalizeDispute = (req,d) => {
  let toJS = d.toJSON;
  if(!toJS) {
    toJS = () => req
  };
  return {
    ...d,
    value: d.value || 0,
    voteCount: d.voteCount || 0,
    finalTally: d.finalTally || 0,
    toJSON: toJS
  }
}

const loadAll = (reqMap) => async (dispatch, getState) => {
  //have to read specific challenges for every request in the map
  let reqs = _.values(reqMap);
  let restored = [];
  let user = getState().chain.chain.ethereumAccount;

  for(let i=0;i<reqs.length;++i) {
    let req = reqs[i];

    let r = await Storage.instance.readAll({
      database: dbNames.NewDispute,
      selector: {
        requestId: req.id
      },
      limit: 50
    });
    if(!r || r.length === 0) {
      continue;
    }
    for(let j=0;j<r.length;++j) {
      let disp = r[j];
      let d = normalizeDispute(reqMap[disp.requestId],disp);
      let req = reqMap[d.requestId];
      if(!req) {
        throw new Error("Somehow have a request reference without valid request");
      }
      let nonce = await dispatch(findDisputedNonce(req, disp));
      d.targetNonce = nonce;
      d.disputer = d.sender;

      restored.push(d);
    }
  }

  let byId = {};
  let dById = {};

  restored.forEach(d=>{
    let h = byId[d.requestId] || {};
    let hById = h.byId || {};
    let hByHash = h.byHash || {};
    hById[d.id] = d;
    dById[d.id] = d;
    hByHash[d.disputeHash] = d;
    h.byId = hById;
    h.byHash = hByHash;
    byId[d.requestId] = h;
  });

  let votesById = await dispatch(voteOps.loadAll(dById));
  _.keys(votesById).forEach(id=>{
    let d = dById[id];
    let votes = votesById[id];
    votes.forEach(v=>{
      let val = v.position?1:-1;
      let userVoted = user === v.voter;
      d = {
        ...d,
        voteCount: d.voteCount + val,
        userVoted
      };
      let h = byId[d.requestId];
      h.byId[d.id] = d;
      h.byHash[d.disputeHash] = d;
    });
  });

  return byId;
}

export default {
  loadAll
}
