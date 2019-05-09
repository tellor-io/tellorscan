import {Creators} from './actions';
import {default as reqOps} from './loaders/requestLoader';
import {findRequestById as findById} from 'Chain/utils';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {registerDeps} from 'Redux/DepMiddleware';
import {Types as settingTypes} from 'Redux/settings/actions';
import {normalizeRequest} from './utils';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  registerDeps([settingTypes.CLEAR_HISTORY_SUCCESS], ()=>{
    dispatch(Creators.initSuccess({}));
  });
  let {current, byId} = await dispatch(reqOps.loadAll());

  dispatch(Creators.initSuccess(byId));
  dispatch(Creators.updateCurrent({challenge: current}));
}

const findRequestById = id => async (dispatch, getState) => {
  let req = getState().requests.byId[id];
  if(req) {
    return;
  }
  req = await dispatch(findById(id));
  if(req) {
    req = normalizeRequest(req);

    await Storage.instance.create({
      database: dbNames.DataRequested,
      key: ""+req.id,
      data: req.toJSON()
    });
    dispatch(Creators.updateRequest(req));
  }
}

export default {
  init,
  findRequestById
}
