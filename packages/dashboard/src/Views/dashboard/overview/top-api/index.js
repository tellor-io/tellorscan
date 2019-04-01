import {connect} from 'react-redux';
import Top from './TopApi';

const s2p = state => {
  return {
    top: "LIBOR" //how is this label determined?
  }
}

const d2p = dispatch => {
  return {

  }
}

export default connect(s2p, d2p)(Top);
