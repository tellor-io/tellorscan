import {Creators} from './actions';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  //load token balances
  dispatch(Creators.initSuccess({balance: 0}));
}

export default {
  init
}
