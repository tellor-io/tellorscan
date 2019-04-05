export const empty = s => {
  if(!s) {
    return true;
  }
  if(typeof s === 'string') {
    return s.trim().length === 0;
  }
  return false;
}

export const isURL = s => {
  if(empty(s)) {
    return false;
  }
  try {
    //not a thorough test but will make sense most of the time. javascript:alert() works for example
    new URL(s);
    return true;
  } catch (e) {
    return false;
  }
}
