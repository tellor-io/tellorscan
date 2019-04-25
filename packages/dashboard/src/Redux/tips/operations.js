import {default as modalOps} from 'Redux/modals/operations';
import {Creators} from './actions';

const ID = "addTip";

const init = () => async (dispatch, getState) => {

}

const showTipModal = (id) => (dispatch, getState) => {
  let req = getState().requests.byId[id];
  dispatch(Creators.selectForTip(req));
  dispatch(modalOps.clear(ID));
  dispatch(modalOps.show(ID));
}

export default {
  init,
  showTipModal
}
