import {combineReducers} from 'redux';
import {default as topRequest} from './topRequest/reducers';
import {default as tips} from './tipsOverTime/reducers';

export default combineReducers(
  {
    topRequest,
    tips
  }
)
