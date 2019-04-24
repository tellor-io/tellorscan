import {connect} from 'react-redux';
import Slots from './Slots';
import _ from 'lodash';

const TOTAL_SLOTS = 5;

const s2p = state => {
  let meta = state.requests.current;
  let current = null;
  if(meta) {
    current = state.requests.byId[meta.id].challenges[meta.challengeHash];
  }
  let filled = [];
  let pending = (typeof current !== 'undefined') && current !== null;

  if(!current || current.finalValue) {
    current = null;
    pending = false;
  } else {
    let slots = _.keys(current.nonces).length;
    for(let i=0;i<TOTAL_SLOTS;++i) {
      filled[i] = (i<slots);
    }
  }

  return {
    pending,
    filled
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Slots);
