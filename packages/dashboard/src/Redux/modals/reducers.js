import {createReducer} from 'reduxsauce';
import {Types} from './actions';

const INIT = {
  visible: {},
  data: {},
  loading: {},
  errors: {}
}

const showhide = (state=INIT, action) => {
  return {
    ...state,
    visible: {
      ...state.visible,
      [action.id]: action.visible
    }
  }
}

const show = (state=INIT, action) => {
  return showhide(state, {
    ...action,
    visible: true
  })
}

const hide = (state=INIT, action) => {
  state = showhide(state, {
    ...action,
    visible: false
  });
  return {
    ...state,
    data: {
      ...state.data,
      [action.id]: undefined
    },
    loading: {
      ...state.loading,
      [action.id]: false
    }
  }
}

const collect = (state=INIT, action) => {
  let newData = {
    ...state.data[action.id],
    ...action.data
  };
  return {
    ...state,
    data: {
      ...state.data,
      [action.id]: newData
    }
  }
}

const clear = (state=INIT, action) => {
  return {
    ...state,
    data: {
      ...state.data,
      [action.id]: undefined
    },
    errors: {
      ...state.errors,
      [action.id]: undefined
    }
  }
}

const load = (state=INIT, action) => {
  return {
    ...state,
    loading: {
      ...state,
      [action.id]: action.loading
    }
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    errors: {
      ...state.errors,
      [action.id]: action.error
    }
  }
}

const HANDLERS = {
  [Types.SHOW]: show,
  [Types.HIDE]: hide,
  [Types.COLLECT_DATA]: collect,
  [Types.CLEAR_DATA]: clear,
  [Types.IS_LOADING]: load,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
