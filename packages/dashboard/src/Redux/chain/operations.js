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
  //initialize the chain class
  chainInit();

  //create the chain instance
  let chain = Chain();
  try {
    //initialize the instance
    await dispatch(chain.init());

    //set it on the redux store
    dispatch(Creators.loadSuccess(chain));

    //initialize the eth processing flow
    await dispatch(ethProcs.init());

  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

/**
 * Startup the flow and any subscriptions
 */
const startSubscriptions = () => async (dispatch,getState) => {
  try {
    await dispatch(ethProcs.ready());
  } catch (e) {
    console.log("Could not start eht processors", e);
  }
}

/**
 * Not guaranteed to be called but is supposed to cleanup
 * any subscriptions
 */
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

/**
 * Calls the contract's requestData method after verifying
 * that the request doesn't already exist
 */
const requestData = props => async (dispatch,getState) => {
  let ex = await dispatch(lookupQueryByHash(props));
  if(ex) {
    throw new Error("Query already exists with id: " + ex);
  }
  return dispatch(_doRequestData(props));
}

/**
 * Calls beginDispute after verifying that the dispute doesn't
 * already exist
 */
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
  //call on-chain to request data
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
  //call on-chain to begin a new dispute
  await con.beginDispute(props.requestId, props.timestamp, props.miner.index)
    .then(()=>{
      return toastr.info("Submitted dispute request");
    }).catch(e=>{
      toastr.error("Error", e.message);
      throw e;
    })
}

/**
 * Calls contract's addTip function
 */
const addToTip = (id,tip) => (dispatch, getState) => {
  let state = getState();
  let req = state.requests.byId[id];
  if(req) {
    let con = state.chain.contract;
    return con.addTip(req.id, tip);
  }
}

/**
 * Calls contract's lazyCoon function to get tokens
 */
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
