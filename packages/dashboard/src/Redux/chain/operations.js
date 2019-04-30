import {Creators} from './actions';
import Chain, {init as chainInit} from 'Chain';
import {toastr} from 'react-redux-toastr';
import {generateQueryHash, generateDisputeHash} from 'Chain/utils';
import ethProcs from './procs';

const init = () => async (dispatch,getState) => {
  if(getState().chain.chain) {
    return;
  }

  dispatch(Creators.loadRequest());
  chainInit();
  let chain = Chain(); //shared instance of whatever chain source we're using
  try {
    await dispatch(chain.init());
    dispatch(Creators.loadSuccess(chain));
    await dispatch(ethProcs.init());
  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

const startSubscriptions = () => async (dispatch,getState) => {
  try {
    await dispatch(ethProcs.ready());
  } catch (e) {
    console.log("Could not start eht processors", e);
  }
}

const unload = () => async (dispatch, getState) => {
  try {

    let chain = getState().chain.chain;
    await dispatch(ethProcs.unload());
    await chain.unload();
  } catch (e) {
    //have to ignore
  }
}

const lookupQueryByHash = props => async (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  let hash = generateQueryHash(props.queryString, props.multiplier);
  let ex = await con.getRequestIdByQueryHash(hash);
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
  let req = state.requests.byId[id];
  if(req) {
    let con = state.chain.contract;
    return con.addTip(req.id, tip);
  }
}

const getTokens = () => (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  return con.getTokens();
}


export default {
  init,
  unload,
  startSubscriptions,
  requestData,
  addToTip,
  lookupQueryByHash,
  lookupDisputeByHash,
  initDispute,
  getTokens
}
