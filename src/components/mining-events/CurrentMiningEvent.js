import React from 'react';

import MiningEventsTable from './MiningEventsTable';

const CurrentMiningEvent = ({ event }) => {
  return (
    <>
      <div className="TableHeader">
        <h2>Current Mining Event</h2>
      </div>
      <MiningEventsTable pagination={false} events={[event]} />
    </>
  );
};

export default CurrentMiningEvent;
