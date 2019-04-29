import {combineReducers} from 'redux';
import {default as topRequest} from './topRequest/reducers';
import {default as tips} from './tipsOverTime/reducers';
import {default as mining} from './mining/reducers';

export default combineReducers(
  {
    topRequest,
    tips,
    mining
  }
)
