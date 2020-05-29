import moment from 'moment';

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...';
};

export const getEventStatus = (event) => {
  if (event.minerValues.length < 5) {
    return 'Mining';
  } else {
    return 'Completed';
  }
};

export const getMinerValueStatus = (value) => {
  // todo: check if open dispute
  // return 'Open Dispute';
  // else
  // can we conditionally do this if the miningValue is in dispute only to cut down on web3 calls?
  return 'Mined';
};

export const getDisputeStatus = (dispute) => {
  if (+dispute.result < 0) {
    return 'Slashed';
  } else if (dispute.tally === null) {
    return 'Open Dispute';
  } else {
    return 'Resolved';
  }
};

export const inDisputeWindow = (timestamp) => {
  return moment.utc().isBefore(moment.unix(timestamp).add(24, 'hours'));
};

export const inVoteWindow = (timestamp) => {
  return moment.utc().isBefore(moment.unix(timestamp).add(7, 'days'));
};
