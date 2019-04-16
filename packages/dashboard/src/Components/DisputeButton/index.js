import {connect} from 'react-redux';
import Button from './DisputeButton';

const s2p = state => {
  return {
    hasTokens: true //state.token.balance > 0
  }
}

const d2p = dispatch => {
  return {
    getTokens: () => {

    }
  }
}

export default connect(s2p,d2p)(Button);
