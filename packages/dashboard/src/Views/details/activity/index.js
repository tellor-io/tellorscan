import {connect} from 'react-redux';
import Activity from './Activity';
import {withRouter} from 'react-router-dom';
import {default as searchOps} from 'Redux/search/operations';
import _ from 'lodash';

const s2p = (state,own) => {
  let id = own.match.params['apiID'];
  let req = state.events.tree.byId[id] || {};

  let challenges = _.values(req.challenges);
  return {
    challenges
  }
}

const d2p = (dispatch,own) => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Activity));
