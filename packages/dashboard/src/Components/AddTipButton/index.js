import {connect} from 'react-redux';
import Button from './AddTipButton';

const s2p = state => {
  console.log("Token balance", state.token.balance);
  return {
    hasTokens: state.token.balance > 0
  }
}

const d2p = dispath => {
  return {
    getTokens: () => {

    }
  }
}

export default connect(s2p, d2p)(Button);
