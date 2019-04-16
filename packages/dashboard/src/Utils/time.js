import moment from 'moment';


const _format = (time, fmt) => {
  let test = new Date(time);
  let diff = Math.abs(new Date().getYear() - test.getYear());
  if(diff > 2) {
    time *= 1000;
  }
  let m = moment.utc(time);
  return m.format(fmt);
}

export const formatTimeLong = (time) => {
  if(typeof time === 'undefined') {
    return "no-time";
  }
  return _format(time, "MM-DD-YYYY HH:mm:ss ZZ");
}

export const formatTime = (time, fmt) => {
  if(typeof time === 'undefined') {
    return "no-time";
  }

  return _format(time, fmt || "YYYY.MM.DD-HH:mm");
}

export const formatHour = (time) => {
  if(!time) {
    return "no-time";
  }
  return _format(time, "HH:mm");
}
