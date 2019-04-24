import {Creators} from './actions';
import {default as reqOps} from './loaders/requestLoader';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  let byId = await dispatch(reqOps.loadAll());
  dispatch(Creators.initSuccess(byId));
}

export default {
  init
}
