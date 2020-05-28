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
  // TODO: get if in dispute
  return 'Mined';
  // return 'Open Dispute';
};

export const getDisputeStatus = (dispute) => {
  if (dispute.disputeVotePassed) {
    return 'Slashed';
  } else {
    return 'Resolved';
  }
};
