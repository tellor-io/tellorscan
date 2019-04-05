import {default as reqOps} from './requests/operations';
import {default as minOps} from './mining/operations';

const initRequests = props => {
  return props.dispatch(reqOps.init())
        .then(()=>props);
}

const initMining = props => {
  return props.dispatch(minOps.init())
      .then(()=>props);

}

const init = () => async (dispatch,getState) => {
  return initRequests({
    dispatch, getState
  }).then(initMining);
}


export default {
  init
}
