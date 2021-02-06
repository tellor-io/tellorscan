import React from 'react';

import MiningEventsTable from './MiningEventsTable';



const AllMiningEvents = ({ events }) => {
  return (
    <>
      <div className="TableHeader">
        <h2>All Mining Events</h2>
      </div>
      <MiningEventsTable pagination={true} events={events} />
    </>
  );
};

export default AllMiningEvents;
