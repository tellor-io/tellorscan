import {connect} from 'react-redux';
import Button from './DisputeButton';
import {generateDisputeHash} from 'Chain/utils';

const s2p = (state,own) => {
  let challenge = own.challenge;
  let nonce = own.nonce;
  let hash = null;

  let user = state.chain.chain.ethereumAccount;
  if(challenge && nonce && challenge.id && nonce.miner) {
    hash = generateDisputeHash({miner: nonce.miner, requestId: challenge.id, timestamp: challenge.finalValue.mineTime});
  }
  
  let match = state.disputes.byHash[hash];
  let canDispute = !match && (typeof challenge.finalValue === 'object');
  //can't dispute if already disputed
  if(match && canDispute) {
    if(match.sender === user) {
      canDispute = false;
    }
  }
  return {
    canDispute,
    hasTokens: state.token.balance > 0
  }
}

const d2p = (dispatch,own) => {
  return {
    getTokens: () => {

    }
  }
}

export default connect(s2p,d2p)(Button);
