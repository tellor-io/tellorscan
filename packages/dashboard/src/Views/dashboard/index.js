import {connect} from 'react-redux';
import Dashboard from './Dashboard';
import {withRouter} from 'react-router-dom';
import {default as chainOps} from 'Redux/chain/operations';

//s2p short for stateToProperties
const s2p = state => {
  return {

  }
}

//d2p short for dispatchToProperties
const d2p = dispatch => {
  return {
    requestData: (props) => dispatch(chainOps.requestData({
      queryString: "https://api.pro.coinbase.com/products/ETH-USD/ticker",
      apiId: 0,
      multiplier: 1000,
      tip: 2
    }))
  }
}

export default withRouter(connect(s2p, d2p)(Dashboard));
