import React from 'react';
import MiningEventsTable from './MiningEventsTable';

const AllMiningModule = ({ events }) => {
  console.log("in AllMiningModule",events);
  return (
    <div className="AllMining">
    {events ? (
          <MiningEventsTable pagination={true} events={events.miningEvents} />
      ) : null}
    </div>
  );
};

export default AllMiningModule;
