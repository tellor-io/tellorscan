import React from 'react';

import MiningEventsTable from './MiningEventsTable';

const AllMiningEvents = ({ events }) => {
  return (
    <div>
      <h2>All Mining Events</h2>
      <MiningEventsTable pagination={true} events={events} />
    </div>
  );
};

export default AllMiningEvents;
