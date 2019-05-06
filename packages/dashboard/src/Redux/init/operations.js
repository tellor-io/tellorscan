import {Creators} from './actions';
import {default as chainOps} from 'Redux/chain/operations';
import {default as analyticOps} from 'Redux/analytics/operations';
import {default as tipOps} from 'Redux/tips/operations';
import {default as disputeOps} from 'Redux/disputes/operations';
import {default as tokenOps} from 'Redux/token/operations';
import {default as reqOps} from 'Redux/requests/operations';

import {registerDeps} from 'Redux/DepMiddleware';
import {Types as settingsTypes} from 'Redux/settings/actions';
import Storage from 'Storage';

const initChain = props => {
  return props.dispatch(chainOps.init())
    .then(()=>props);
}

const initStorage = async props => {
  let chain = props.getState().chain.chain;

  console.log("Network", chain.network);
  await Storage.instance.init({
    dbPrefix: props.getState().chain.chain.network
  });
  return props;
}

const initRequests = props => {
  return props.dispatch(reqOps.init())
  .then(()=>props);
}

const initAnalytics = props => {
  return props.dispatch(analyticOps.init())
  .then(()=>props)
}

const initTips = props => {
  return props.dispatch(tipOps.init())
      .then(()=>props);
}

const initDisputes = props => {
  return props.dispatch(disputeOps.init())
          .then(()=>props);
}

const initToken = props => {
  return props.dispatch(tokenOps.init())
      .then(()=>props);
}

const unloadChain = props => {
  return props.dispatch(chainOps.unload())
      .then(()=>props);
}

const startSubscriptions = props => {
  return props.dispatch(chainOps.startSubscriptions())
        .then(()=>props);
}

const start = () => (dispatch,getState) => {
  let state = getState();
  if(state.init.initComplete) {
    return;
  }
  registerDeps([settingsTypes.CLEAR_HISTORY_SUCCESS], async () => {
    dispatch(_doStart());
  });
  return dispatch(_doStart());
}

const _doStart = () => (dispatch,getState) => {
  dispatch(Creators.initStart());
  let props = {
    dispatch,
    getState
  }
  return initChain(props)
        .then(initStorage)
        .then(initToken)
        .then(initRequests)
        .then(initTips)
        .then(initDisputes)
        .then(initAnalytics)
        .then(startSubscriptions)
        .then(()=>{
          dispatch(Creators.initSuccess());
        })
        .catch(e=>{
          dispatch(Creators.failure(e));
        });
}

const unload  = () => (dispatch,getState) => {
  let props = {
    dispatch, getState
  };
  return unloadChain(props);
}

export default {
  start,
  unload
}
