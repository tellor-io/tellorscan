import {connect} from 'react-redux';
import Price from './TellorPrice';

const s2p = state => {
  let current = state.current || {};
  let price = current.price || 0;

  return {
    price: `$${price.toFixed(2)}`
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Price);
