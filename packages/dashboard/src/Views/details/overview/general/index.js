import {connect} from 'react-redux';
import Info from './Info';
import {withRouter} from 'react-router-dom';
import copy from 'copy-to-clipboard';
import {toastr} from 'react-redux-toastr';

const s2p = (state, own) => {
  let byId = state.requests.byId; //state.events.tree.byId;
  let id = own.match.params['apiID'];
  let q = byId[id];

  return {
    id,
    item: q
  }
}

const d2p = dispatch => {
  return {
    copy: text => {
      copy(text);
      toastr.info("Copied to clipboard");
    }
  }
}

export default withRouter(connect(s2p, d2p)(Info));
