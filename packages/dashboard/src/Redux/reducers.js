import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
  toastr: toastrReducer
});
