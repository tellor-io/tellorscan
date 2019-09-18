import {Creators} from './actions';
import {findRequestById as findById} from 'Chain/utils';
import Storage from 'Storage';
import * as DBNames from 'Storage/DBNames';
import {registerDeps} from 'Redux/DepMiddleware';
import {Types as settingTypes} from 'Redux/settings/actions';
import {Logger} from 'buidl-utils';

const log = new Logger({component: "NewRequestOps"});

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  registerDeps([settingTypes.CLEAR_HISTORY_SUCCESS], ()=>{
    dispatch(Creators.initSuccess({}));
  });
  
  let existing = getState().newRequests.requests;
  try {
    let all = await Storage.instance.readAll({
      database: DBNames.DataRequested
    });
    all.forEach(r=>{
      if(!existing[r.id]) {
        existing[r.id] = r;
      }
    })
    dispatch(Creators.initSuccess(existing));
  } catch (e) {
    log.error("Problem getting stored data requests", e);
    dispatch(Creators.failure(e));
  }
}

const findRequestById = (id, con) => async (dispatch, getState) => {
  let req = getState().newRequests.byId[id];
  if(req) {
    return req;
  }
  req = await dispatch(findById(id, con));
  if(req) {
    await Storage.instance.create({
      database: DBNames.DataRequested,
      key: ""+req.id,
      data: req.toJSON()
    });
    dispatch(Creators.addRequest(req));
  } else {
    log.warn("Could not find request with id", id);
  }
  return req;
}

const setCurrentTip = (id, tip) => async (dispatch, getState) => {
  let req = getState().newRequests.byId[id];
  if(!req) {
    req = await findRequestById(id);
    if(!req) {
      return;
    }
  }
  req =  {
    ...req,
    currentTip: tip
  };
  dispatch(Creators.addRequest(req));
}

export default {
  init,
  findRequestById,
  setCurrentTip
}
