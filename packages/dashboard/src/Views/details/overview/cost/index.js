import {connect} from 'react-redux';
import V2C from './ValueToCost';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';

const s2p = (state,own) => {
  let id = own.match.params['apiID'];
  
  let recentTips = [];
  if(id) {
    id -= 0;
    recentTips = state.tips.tips.filter(t=>t.id===id);
  } else {
    recentTips = [
      ...state.tips.tips
    ]
  }

  recentTips.sort((a,b)=>a.blockNumber-b.blockNumber);
  console.log("RECENT TIPS", recentTips);
  return {
    loading: state.analytics.loading,
    data: recentTips
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(V2C));
