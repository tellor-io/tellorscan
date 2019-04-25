import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  loading: false,
  error: null,
  selectedRequest: null
}

const select = (state=INIT, action) => {
  return {
    ...state,
    selectedRequest: action.request
  }
}

const HANDLERS = {
  [Types.SELECT_FOR_TIP]: select
}

export default createReducer(INIT, HANDLERS);
