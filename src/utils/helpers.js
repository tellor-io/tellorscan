import moment from 'moment';
import { psrLookup } from './psrLookup';

export const
  VOTING_OPEN = "Open Voting",
  VOTING_DENIED = "Voting Denied",
  MINED = "Mined",
  MINING = "Mining",
  VOTING_PASSED = "Voting Passed",
  CONTRACT_UPGRADE = "contract upgrade";

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
};

export const fromWei = (value) => {
  let v = value / 1e18
  return v
}

export const getEventStatus = (minerValues) => {
  if (minerValues.length < 5) {
    return MINING;
  } else {
    return MINED;
  }
};

export const getMatchingDispute = (openDisputes, miningEvent) => {
  return openDisputes.disputes.find((dispute) => {
    return dispute.requestId === miningEvent.requestId && dispute.timestamp === miningEvent.timestamp
  });
};

export const getMinedValueStatus = (value, openDisputes, miningEvent) => {
  const matchingDispute = getMatchingDispute(openDisputes, miningEvent);

  if (matchingDispute && matchingDispute.miner === value.miner) {
    return VOTING_OPEN;
  } else {
    return MINED;
  }
};

export const getDisputeStatus = (status) => {
  if (status === true) {
    return VOTING_PASSED;
  } else if (status === null) {
    return VOTING_OPEN;
  } else {
    return VOTING_DENIED;
  }
};

export const inDisputeWindow = (timestamp) => {
  return moment.utc().isBefore(moment.unix(timestamp).add(24, 'hours'));
};

export const inVoteWindow = (timestamp) => {
  if (timestamp == 0) { // There is a bug in the contract that for contract upgrades the timestamp is not set.
    return true
  }
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
