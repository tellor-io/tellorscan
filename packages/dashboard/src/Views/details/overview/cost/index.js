import {connect} from 'react-redux';
import V2C from './ValueToCost';
import {withRouter} from 'react-router-dom';

const s2p = (state,own) => {
  let id = own.match.params['apiID'];
  let data = state.analytics.tips.data;
  let tips =  data.filter(d=>d.id-0 === id-0);

  return {
    loading: state.analytics.loading,
    data: tips
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(V2C));
