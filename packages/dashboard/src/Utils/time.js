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

export const normalizeToMinute = time => {
  let test = new Date(time);
  let diff = Math.abs(new Date().getYear() - test.getYear());
  let inSecs = false;
  if(diff > 2) {
    time *= 1000;
    inSecs = true;
  }
  let t = time - (time % 60000);
  return inSecs?Math.floor(t/1000):t;
}

export const humanizeDuration = d => {
  let m = moment.duration(d);
  return m.humanize();
}

export const formatDuration = d => {
  let m = moment.duration(d);
  let labels = ['d','h','m','s'];
  let slots =[m.days(),
              m.hours(),
              m.minutes(),
              m.seconds()];
  let format = "";
  for(let i=slots.length-1;i>=0;--i) {
    let l = labels[i];
    let v = slots[i];
    format = `${v}${l} ${format}`;
  }
  return format.trim();
}
