export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...';
};

export const getEventStatus = (event) => {
  // console.log('event', event);

  if (event.minerValues.length < 5) {
    return 'Mining';
  } else {
    return 'Completed';
  }
};
