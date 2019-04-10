import {connect} from 'react-redux';
import Costs from './Costs';

const s2p = state => {
  let buckets = [
    ...state.analytics.tips.data
  ];
  let loading = state.events.requests.loading ||
                state.events.mining.loading ||
                state.analytics.tips.loading;

  return {
    loading,
    buckets: buckets
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Costs);
