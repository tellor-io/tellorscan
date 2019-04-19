import {Creators} from './actions';
import {default as chainOps} from 'Redux/chain/operations';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  let state = getState();
  let con = state.chain.contract;
  try {
    let b = await con.balanceOf(state.chain.chain.ethereumAccount);
    dispatch(Creators.initSuccess({balance: b?b.toString()-0:0}));
  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

const getTokens = () => async (dispatch, getState) => {
  let con = getState().chain.contract;
  dispatch(Creators.initStart());
  con.getTokens().then(async () => {
    let b = await con.balanceOf(getState().chain.chain.ethereumAccount);
    dispatch(Creators.initSuccess({balance: b?b.toString()-0:0}));
  }).catch(e=>{
      dispatch(Creators.failure(e));
  });
}


const getBalance = () => async (dispatch, getState) => {
  let con = getState().chain.contract;
  let b = await con.balanceOf(getState().chain.chain.ethereumAccount);
  dispatch(Creators.update({balance: b?b.toString()-0:0}));
}

export default {
  init,
  getTokens,
  getBalance
}
