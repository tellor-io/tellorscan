import {Creators} from './actions';
import Chain, {init as chainInit} from 'Chain';
import {toastr} from 'react-redux-toastr';
import {generateQueryHash, generateDisputeHash} from 'Chain/utils';

import {registerDeps} from 'Redux/DepMiddleware';
import {Types as settingsTypes} from 'Redux/settings/actions';

const init = () => async (dispatch,getState) => {
  registerDeps([settingsTypes.CLEAR_HISTORY_SUCCESS], async () => {
    let state = getState();
    return state.chain.chain.init();
  });

  dispatch(Creators.loadRequest());
  //TODO: pass any init props if needed
  chainInit();
  let chain = Chain(); //shared instance of whatever chain source we're using
  try {
    await chain.init(chain);
    dispatch(Creators.loadSuccess(chain));
  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

const unload = () => async (dispatch, getState) => {
  try {

    let chain = getState().chain.chain;
    await chain.unload();
  } catch (e) {
    //have to ignore
  }
}

const lookupQueryByHash = props => async (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  let hash = generateQueryHash(props.queryString, props.multiplier);
  let ex = await con.getApiId(hash);
  if(ex && ex.toString) {
    ex = ex.toString()-0;
  }
  return ex || 0;
}

const lookupDisputeByHash = props => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  let hash = generateDisputeHash({miner: props.miner.address, requestId: props.requestId, timestamp: props.timestamp});
  let ex = await con.getDisputeIdByDisputeHash(hash);
  if(ex && ex.toString) {
    ex = ex.toString()-0;
  }
  return ex || 0;
}

const requestData = props => async (dispatch,getState) => {
  let ex = await dispatch(lookupQueryByHash(props));
  if(ex) {
    throw new Error("Query already exists with id: " + ex);
  }
  return dispatch(_doRequestData(props));
}

const initDispute = props => async (dispatch, getState) => {
  let ex = await dispatch(lookupDisputeByHash(props));
  if(ex) {
    toastr.error("Error", "Dispute already active for miner,requestId,timestamp combination");
  } else {
    await dispatch(_doInitDispute(props));
  }
}

const _doRequestData = props => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  await con.requestData(props.queryString, props.symbol, props.apiId, props.multiplier, props.tip)
    .then(()=>{
      return toastr.info("Submitted data request");
    }).catch(e=>{
      toastr.error("Error", e.message);
      throw e;
    });
}

const _doInitDispute = props => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  await con.beginDispute(props.requestId, props.timestamp, props.miner.index)
    .then(()=>{
      return toastr.info("Submitted dispute request");
    }).catch(e=>{
      toastr.error("Error", e.message);
      throw e;
    })
}

const addToTip = (id,tip) => (dispatch, getState) => {
  let state = getState();
  let req = state.events.tree.byId[id];
  if(req) {
    let con = state.chain.contract;
    return con.addTip(req.id, tip);
  }
}

export default {
  init,
  unload,
  requestData,
  addToTip,
  lookupQueryByHash,
  lookupDisputeByHash,
  initDispute
}
