import {createReducer} from 'reduxsauce';
import {Types} from './actions';
import * as yup from 'yup';

const resultsSchema = yup.object().shape({
  total: yup.number().required("Missing total field in search results"),
  data: yup.object().shape({
    metadata: yup.object().required("Missing metadata"),
    events: yup.array().of(yup.object()),
    page: yup.number().required("Missing data page")
  })
});

const INIT = {
  loading: false,
  error: null,
  focusId: null,
  results: {
    total: 0,
    data: {
      metadata: {},
      events: [],
      page: 0
    }
  },
  pageSize: 10,
  sort: null
}

const start = (state=INIT, action) => {
  return {
    ...state,
    loading: true,
    error: null,
    focusId: action.id
  }
}

const success = (state=INIT, action) => {
  resultsSchema.validateSync(action.data);

  return {
    ...state,
    loading: false,
    results: {
      ...action.data
    }
  }
}

const setPageSize = (state=INIT, action) => {
  return {
    ...state,
    pageSize: action.size || 10
  }
}

const setSort = (state=INIT, action) => {
  return {
    ...state,
    sort: action.sort
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const HANDLERS = {
  [Types.SEARCH_START]: start,
  [Types.SEARCH_SUCCESS]: success,
  [Types.FAILURE]: fail,
  [Types.SET_PAGE_SIZE]: setPageSize,
  [Types.SET_SORT]: setSort
}

export default createReducer(INIT, HANDLERS);
