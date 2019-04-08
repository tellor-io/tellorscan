import {default as reqOps} from 'Redux/events/requests/operations';

export const findAPI = (id) => async (dispatch,getState) => {
  let state = getState();
  let apis = state.events.requests.byId || {};
  let q = apis[id];
  if(!q) {
    q = await dispatch(reqOps.lookup(id));
  }
  return q;
}
