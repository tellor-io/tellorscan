import {connect} from 'react-redux';
import Stream from './Streaming';
import {withRouter} from 'react-router-dom';
import {default as qOps} from 'Redux/queries/operations';
import * as navs from 'Navs';
import _ from 'lodash';

const s2p = state => {
  let subsById = state.events.mining.submissionsById;
  let valsById = state.events.mining.valuesById;
  let merged = [];
  _.keys(subsById).forEach(k=>{
    merged = _.concat(merged, subsById[k]);
  });
  _.keys(valsById).forEach(k=>{
    merged = _.concat(merged, valsById[k]);
  })

  merged.sort((a,b)=>{
    if(a.blockNumber > b.blockNumber) {
      return -1; //descending
    } else if(a.blockNumber < b.blockNumber) {
      return 1;
    }
    return 0;
  });

  return {
    events: merged
  }
}

const d2p = (dispatch, own) => {
  return {
    viewAPI: id => {

      dispatch(qOps.select(id));
      let url = navs.DETAILS_HOME + "/" + id;
      own.history.push(url);
    }
  }
}

export default withRouter(connect(s2p, d2p)(Stream));
