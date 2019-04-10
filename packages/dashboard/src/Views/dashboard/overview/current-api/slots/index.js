import {connect} from 'react-redux';
import Slots from './Slots';

const TOTAL_SLOTS = 5;

const s2p = state => {
  let current = state.current || {};
  let challenge = current.currentChallenge;
  let slots = current.minedSlots || 0;
  let filled = [];
  for(let i=0;i<TOTAL_SLOTS;++i) {
    filled[i] = (i<slots);
  }
  let pending = (typeof challenge !== 'undefined') && challenge !== null;
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
