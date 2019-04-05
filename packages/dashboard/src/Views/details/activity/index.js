import {connect} from 'react-redux';
import Activity from './Activity';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';

const s2p = (state,own) => {
  let id = own.match.params['apiID'];

  if(!id) {
    return {
      events: []
    }
  }
  id = id-0;//make sure numeric comparison
  let subs = state.events.mining.submissionsById[id] || [];
  let vals = state.events.mining.valuesById[id] || [];
  let merged = _.concat([], subs);
  merged = _.concat(merged, vals);
  console.log("Merged", merged, id);

  merged = merged.filter(e=>e.id-0 === id);
  return {
    events: merged
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Activity));
