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

export const humanizeTellor = (amt) => {
  let res = util.toBN(amt).div(TRIBUTE);
  let num = res.toString()-0;
  return num.toFixed(2);
}

export const updateReward = (ex, rank) => {
  let rew = REWARDS[rank];
  return util.toBN(ex).add(rew);
}
