import {connect} from 'react-redux';
import Costs from './Costs';

const s2p = state => {
  let data = [
    ...state.analytics.tips.data
  ];
  let loading = state.events.tree.loading ||
                state.analytics.tips.loading;

  return {
    loading,
    data
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Costs);
