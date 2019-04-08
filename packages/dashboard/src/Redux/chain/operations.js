import {Creators} from './actions';
import Chain, {init as chainInit} from 'Chain';
import {toastr} from 'react-redux-toastr';
import {generateQueryHash} from 'Chain/utils';

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

const lookupQueryByHash = props => async (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  let hash = generateQueryHash(props.queryString, props.multiplier);
  let ex = await con.getApiId(hash);
  return ex;
}

const requestData = props => async (dispatch,getState) => {
  let ex = await dispatch(lookupQueryByHash(props));
  if(ex) {
    throw new Error("Query already exists with id: " + ex);
  }
  return dispatch(_doRequestData(props));
}

const _doRequestData = props => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  await con.requestData(props.queryString, props.apiId, props.multiplier, props.tip, props.symbol)
    .then(()=>{
      toastr.info("Submitted data request");
    }).catch(e=>{
      toastr.error("Error", e.message);
      throw e;
    });
}

const addToTip = (id,tip) => (dispatch, getState) => {
  let state = getState();
  let req = state.events.requests.byId[id];
  if(req) {
    return dispatch(_doRequestData({
    queryString: req.queryString,
    apiId: req.id,
    multiplier: req.multiplier,
    tip}));
  }
}

export default {
  init,
  requestData,
  addToTip,
  lookupQueryByHash
}
