import {connect} from 'react-redux';
import V2C from './ValueToCost';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';

const s2p = (state,own) => {
  let id = own.match.params['apiID'];
  let reqs = state.requests.byId;
  let recentTips = [];
  if(id) {
    let tgt = reqs[id-0] || {};
    let tips = tgt.tips || [];
    tips.forEach(t=>{
      recentTips.push(t);
      recentTips.sort((a,b)=>b.blockNumber-a.blockNumber);
    });
  } else {
    _.values(reqs).forEach(r=>{
      r.tips.forEach(t=>{
        recentTips.push(t);
        recentTips.sort((a,b)=>b.blockNumber-a.blockNumber);
      });
    });
  }

  recentTips.sort((a,b)=>a.blockNumber-b.blockNumber);
  if(recentTips.length > 50) {
    recentTips.splice(0,50);
  }

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
