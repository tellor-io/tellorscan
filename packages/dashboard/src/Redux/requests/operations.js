import {Creators} from './actions';
import {default as reqOps} from './loaders/requestLoader';
import {findRequestById as findById} from 'Chain/utils';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  let byId = await dispatch(reqOps.loadAll());
  dispatch(Creators.initSuccess(byId));
}

const findRequestById = id => async (dispatch, getState) => {
  let req = getState().requests.byId[id];
  if(req) {
    return;
  }
  req = await dispatch(findById(id));
  if(req) {
    await Storage.instance.create({
      database: dbNames.DataRequested,
      key: ""+req.id,
      data: req.toJSON()
    });
  }
}

export default {
  init,
  findRequestById
}
