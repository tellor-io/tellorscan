import {default as top} from './topRequest/operations';

const init = () => dispatch => {
  return dispatch(top.init());
}

export default {
  init
}
