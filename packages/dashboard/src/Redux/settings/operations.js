import {Creators} from './actions';
import Storage from 'Storage';

const clearHistory = () => async dispatch => {
  dispatch(Creators.clearHistoryStart());
  try {
    await Storage.instance.clearAll();
    dispatch(Creators.clearHistorySuccess());
  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

export default {
  clearHistory
}
