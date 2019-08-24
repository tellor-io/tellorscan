import {Creators} from './actions';
import Storage from 'Storage';
import {default as chainOps} from 'Redux/chain/operations';

const clearHistory = () => async dispatch => {
  dispatch(Creators.clearHistoryStart());
  try {
    await Storage.instance.clearAll();
    dispatch(Creators.clearHistorySuccess());
  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

const toggleRealtime = () => dispatch => {
  dispatch(Creators.toggleRealtime());
}

export default {
  clearHistory,
  toggleRealtime
}
