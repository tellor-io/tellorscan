import {default as modalOps} from 'Redux/modals/operations';
import {Creators} from './actions';
import Storage from 'Storage';
import * as DBNames from 'Storage/DBNames';

const ID = "addTip";

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  let r = await Storage.instance.readAll({
    database: DBNames.TipAdded,
    sort: [
      {
        field: "blockNumber",
        order: "DESC"
      }
    ]
  });
  if(r.length > 0) {
    if(r.length > 50) {
      r = r.slice(0, 50);
    }
  }
  dispatch(Creators.initSuccess(r));
}

const showTipModal = (id) => (dispatch, getState) => {
  let req = getState().newRequests.byId[id];
  dispatch(Creators.selectForTip(req));
  dispatch(modalOps.clear(ID));
  dispatch(modalOps.show(ID));
}

const addTips = (tips) => (dispatch) => {
  dispatch(Creators.addTips(tips));
}

export default {
  init,
  addTips,
  showTipModal
}
