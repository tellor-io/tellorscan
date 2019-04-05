import {connect} from 'react-redux';
import Info from './Info';
import {withRouter} from 'react-router-dom';
import {findAPI} from 'Views/details/common';

const s2p = (state, own) => {
  let q = state.queries.selectedQuery;
  let id = own.match.params['apiID'];
  if(!q && id) {
    q = findAPI(id, state);
  }
  return {
    item: q
  }
}

const d2p = dispatch => {
  return {

  }
}

export default withRouter(connect(s2p, d2p)(Info));
