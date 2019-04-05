import moment from 'moment';


export const formatTime = (time) => {
  if(typeof time === 'undefined') {
    return -1;
  }

  let test = new Date(time);
  let diff = Math.abs(new Date().getYear() - test.getYear());
  if(diff > 2) {
    time *= 1000;
  }
  let m = moment.utc(time);
  return m.format("YYYY.MM.DD-HH:mm");
}
