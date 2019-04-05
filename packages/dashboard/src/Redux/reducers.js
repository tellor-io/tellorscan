import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr'
import {default as events} from './events/reducers';
import {default as init} from './init/reducers';
import {default as queries} from './queries/reducers';
import {default as current} from './current/reducers';
import {default as chain} from './chain/reducers';

export default combineReducers({
  toastr: toastrReducer,
  events,
  init,
  queries,
  current,
  chain
});
