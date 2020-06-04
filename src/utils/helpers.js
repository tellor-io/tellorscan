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

export const getMatchingDispute = (openDisputes, miningEvent) => {
  return openDisputes.find((dispute) => {
    return (
      dispute.requestId === miningEvent.requestId &&
      dispute.timestamp === miningEvent.time
    );
  });
};

export const getMinerValueStatus = (value, openDisputes, miningEvent) => {
  const matchingDispute = getMatchingDispute(openDisputes, miningEvent);

  if (matchingDispute && matchingDispute.miner === value.miner) {
    return 'Open Dispute';
  } else {
    return 'Mined';
  }
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
