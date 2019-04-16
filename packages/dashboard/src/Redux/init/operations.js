import {Creators} from './actions';
import {default as eventOps} from 'Redux/events/operations';
import {default as currentOps} from 'Redux/current/operations';
import {default as chainOps} from 'Redux/chain/operations';
import {default as analyticOps} from 'Redux/analytics/operations';
import {default as tipOps} from 'Redux/tips/operations';
import {default as disputeOps} from 'Redux/disputes/operations';
import {default as tokenOps} from 'Redux/token/operations';

const initChain = props => {
  return props.dispatch(chainOps.init())
    .then(()=>props);
}

const initCurrent = props => {
  return props.dispatch(currentOps.init())
  .then(()=>{
    return props
  });
}

const initEvents = props => {
  return props.dispatch(eventOps.init())
  .then(()=>{
    return props
  });
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

const start = () => (dispatch,getState) => {
  let state = getState();
  if(state.init.initComplete) {
    return;
  }

  dispatch(Creators.initStart());
  let props = {
    dispatch,
    getState
  }
  return initChain(props)
        .then(initToken)
        .then(initCurrent)
        .then(initEvents)
        .then(initTips)
        .then(initDisputes)
        .then(initAnalytics)
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
