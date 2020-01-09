import * as util from 'web3-utils';

const BASE = util.toBN("1000000000");
const TRIBUTE = util.toBN("1000000000").mul(BASE);
const REWARDS = [
          util.toBN("5").mul(TRIBUTE),
          util.toBN("5").mul(TRIBUTE),
          util.toBN("5").mul(TRIBUTE),
          util.toBN("5").mul(TRIBUTE),
          util.toBN("5").mul(TRIBUTE)
        ];
export const toFixed = (x) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}
export const humanizeTellor = (amt) => {
  let res = util.toBN(amt).div(TRIBUTE);
  let num = res.toString()-0;
  return num.toFixed(2);
}

export const updateReward = (ex, rank) => {
  let rew = REWARDS[rank];
  return util.toBN(ex).add(rew);
}
