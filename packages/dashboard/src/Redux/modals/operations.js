import {Creators} from './actions';

const show = (id) => dispatch => {
  dispatch(Creators.show(id));
}

const hide = (id) => dispatch => {
  dispatch(Creators.hide(id));
}

const collect = (id, data) => dispatch => {
  dispatch(Creators.collectData(id, data));
}

const clear = (id, data) => dispatch => {
  dispatch(Creators.clearData(id, data));
}

const isLoading = (id, loading) => dispatch => {
  dispatch(Creators.isLoading(id, loading));
}

const failure = (id, err) => dispatch => {
  dispatch(Creators.failure(id, err));
}

export default {
  show,
  hide,
  collect,
  clear,
  isLoading,
  failure
}
