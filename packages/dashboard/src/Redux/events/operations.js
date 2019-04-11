//import {default as reqOps} from './requests/operations';
//import {default as minOps} from './mining/operations';
import {default as treeOps} from './tree/operations';

/*
const initRequests = props => {
  return props.dispatch(reqOps.init())
        .then(()=>props);
}

const initMining = props => {
  return props.dispatch(minOps.init())
      .then(()=>props);

}
*/

const initTree  = props => {
  return props.dispatch(treeOps.init())
        .then(()=>props);
}

const init = () => async (dispatch,getState) => {
  return initTree({dispatch, getState});
  /*
  return initRequests({
    dispatch, getState
  })
  .then(initMining)
  .then(initTree);
  */
}


export default {
  init
}
