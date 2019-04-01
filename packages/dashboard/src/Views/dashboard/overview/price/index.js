import {connect} from 'react-redux';
import Price from './TellorPrice';

const s2p = state => {
  return {
    price: "$5000"
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Price);
