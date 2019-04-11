import {connect} from 'react-redux';
import Details from './Details';
import {withRouter} from 'react-router-dom';
import {default as qOps} from 'Redux/events/tree/operations';

//s2p short for stateToProperties
const s2p = (state,own) => {
  return {
    
  }
}

//d2p short for dispatchToProperties
const d2p = (dispatch,own) => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Details));
