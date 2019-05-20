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

export const fixLength = (s, max) => {
  if(!s) {
    return s;
  }
  if(s.length > max) {
    let  mid = Math.floor(max/2);
    let start = s.substring(0, mid);
    let end = s.substring(s.length-mid);
    return start + "..." + end;
  }
  return s;
}
