import {connect} from 'react-redux';
import Costs from './Costs';
import _ from 'lodash';

const s2p = state => {
  let reqs = _.values(state.requests.byId);
  let recentTips = [];
  reqs.forEach(r=>{
    r.tips.forEach(t=>{
      recentTips.push(t);
      recentTips.sort((a,b)=>b.blockNumber-a.blockNumber);
    });
  })

  recentTips.sort((a,b)=>a.blockNumber-b.blockNumber);
  if(recentTips.length > 50) {
    recentTips.splice(0,50);
  }

  let loading = state.events.tree.loading ||
                state.analytics.tips.loading;

  return {
    loading,
    data: recentTips
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Costs);
