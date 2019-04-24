import {default as treeOps} from './tree/operations';

const initTree  = props => {
  return props.dispatch(treeOps.init())
        .then(()=>props);
}

const init = () => async (dispatch,getState) => {
  return initTree({dispatch, getState});
}

export default {
  init
}
