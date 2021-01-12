import moment from 'moment';
import { psrLookup } from './psrLookup';

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...';
};

export const getEventStatus = (minerValues) => {
  if (minerValues.length < 5) {
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
    return 'Passed';
  }
};

export const inDisputeWindow = (timestamp) => {
  return moment.utc().isBefore(moment.unix(timestamp).add(24, 'hours'));
};

export const inVoteWindow = (timestamp) => {
  return moment.utc().isBefore(moment.unix(timestamp).add(7, 'days'));
};

export const getMedianValue = (allMinerValues, index) => {
  const values = allMinerValues.map((val) => {
    return val.values[index];
  });
  const mid = Math.floor(values.length / 2),
    nums = [...values].sort((a, b) => a - b);
  return values.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

export const getGranPrice = (value, requestId) => {
  return +value / +psrLookup[requestId].granularity;
};
