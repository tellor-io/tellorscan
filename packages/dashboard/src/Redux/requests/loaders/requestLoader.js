import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {Creators} from '../actions';
import {default as chOps} from './challengeLoader';
import {default as tipOps} from './tipLoader';
import {default as dispOps} from './disputeLoader';
import _ from 'lodash';

const normalizeRequest = req => {
  let toJS = req.toJSON;
  if(!toJS) {
    toJS = () => req
  }
  return {
    ...req,
    challenges: {
      ...req.challenges
    },
    disputes: {
      ...req.disputes
    },
    tips: [],
    currentTip: req.currentTip || 0,
    toJSON: toJS
  }
}

const loadAll = () => async (dispatch, getState) => {
  let r = await Storage.instance.readAll({
    database: dbNames.DataRequested,
    limit: 50
  });
  if(!r) {
    r = [];
  }
  let byId = r.reduce((o,dr)=>{
    o[dr.id] = normalizeRequest(dr);
    return o;
  },{});

  let chById = await dispatch(chOps.loadAll(byId));
  _.keys(chById).forEach(id=>{
    let req = byId[id];
    let challenges = chById[id];

    if(req) {
      byId[id] = {
        ...req,
        challenges: chById[id]
      }
    }
  });

  let tipsById = await dispatch(tipOps.loadAll(byId));
  _.keys(tipsById).forEach(id=>{
    let req = byId[id];
    if(req) {
      byId[id] = {
        ...req,
        tips: tipsById[id]
      }
    }
  });

  let disputesById = await dispatch(dispOps.loadAll(byId));
  _.keys(disputesById).forEach(id=>{
    let req = byId[id];
    if(req) {
      byId[id] = {
        ...req,
        disputes: disputesById[id]
      }
    }
  });

  return byId;
}

const incomingEvents = (ctx) => async (dispatch, getState) => {
  let byId = getState().requests.byId;
  let evt = ctx.eventMap[dbNames.DataRequested];
  if(!evt) {
    return;
  }
  if(!byId[evt.id]) {
    dispatch(Creators.addRequest({request: normalizeRequest(evt)}));
  }
}

export default {
  loadAll,
  incomingEvents
}
