import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr'
import {default as events} from './events/reducers';
import {default as init} from './init/reducers';
import {default as current} from './current/reducers';
import {default as chain} from './chain/reducers';
import {default as modals} from './modals/reducers';
import {default as settings} from './settings/reducers';
import {default as analytics} from './analytics/reducers';
import {default as tips} from './tips/reducers';
import {default as disputes} from './disputes/reducers';
import {default as token} from './token/reducers';
import {default as requests} from './requests/reducers';

export default combineReducers({
  toastr: toastrReducer,
  events,
  init,
  current,
  chain,
  modals,
  settings,
  analytics,
  tips,
  disputes,
  token,
  requests
});
