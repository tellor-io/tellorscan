import {default as top} from './topRequest/operations';
import {default as tips} from './tipsOverTime/operations';

const initTop = (props) => {
  return props.dispatch(top.init())
         .then(()=>props)
}

const initTips = props => {
  return props.dispatch(tips.init())
        .then(()=>props)
}

const init = () => (dispatch,getState) => {
  let props = {
    dispatch,
    getState
  };
  return initTop(props)
          .then(initTips);
}

export default {
  init
}
