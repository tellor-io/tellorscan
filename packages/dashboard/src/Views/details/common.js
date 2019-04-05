
export const findAPI = (id, state) => {
  let apis = state.events.requests.byId || {};
  return apis[id];
}
