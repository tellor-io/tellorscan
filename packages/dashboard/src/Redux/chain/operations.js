import {Creators} from './actions';
import Chain, {init as chainInit} from 'Chain';
import {toastr} from 'react-redux-toastr';

const init = () => async dispatch => {
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

const requestData = props => (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  return con.requestData(props.queryString, props.apiId, props.multiplier, props.tip)
    .then(()=>{
      toastr.info("Submitted data request");
    }).catch(e=>{
      toastr.error("Error", e.message);
    });
}

const addToTip = (id,tip) => (dispatch, getState) => {
  let state = getState();
  let req = state.events.requests.byId[id];
  if(req) {
    return dispatch(requestData({
    queryString: req.queryString,
    apiId: req.id,
    multiplier: req.multiplier,
    tip}));
  }
}

export default {
  init,
  requestData,
  addToTip
}
