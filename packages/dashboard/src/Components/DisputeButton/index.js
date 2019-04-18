import {connect} from 'react-redux';
import Button from './DisputeButton';
import {generateDisputeHash} from 'Chain/utils';

const s2p = (state,own) => {
  let challenge = own.challenge;
  let nonce = own.nonce;
  let hash = null;

  if(challenge && nonce && challenge.id && nonce.miner) {
    hash = generateDisputeHash({miner: nonce.miner, requestId: challenge.id, timestamp: challenge.finalValue.mineTime});
  }
  let req = state.events.tree.byId[challenge.id] || {};
  let disputes = req.disputes || {};
  let match = disputes[hash];
  let canDispute = !match && challenge.finalValue;
  return {
    canDispute,
    hasTokens: true //state.token.balance > 0
  }
}

const d2p = (dispatch,own) => {
  return {
    getTokens: () => {

    }
  }
}

export default connect(s2p,d2p)(Button);
