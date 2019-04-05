import {Creators} from './actions';
import {default as eventOps} from 'Redux/events/operations';
import {default as queryOps} from 'Redux/queries/operations';
import {default as currentOps} from 'Redux/current/operations';
import {default as chainOps} from 'Redux/chain/operations';

const initChain = props => {
  return props.dispatch(chainOps.init())
    .then(()=>props);
}

const initQueries = props => {
  return props.dispatch(queryOps.init())
  .then(()=>{
    return props
  });
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
        .then(initQueries)
        .then(initCurrent)
        .then(initEvents)
        .then(()=>{
          dispatch(Creators.initSuccess());
        })
        .catch(e=>{
          dispatch(Creators.failure(e));
        });
}

export default {
  start
}
