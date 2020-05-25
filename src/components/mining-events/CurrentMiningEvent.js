import React from 'react';

import MiningEventsTable from './MiningEventsTable';

const CurrentMiningEvent = ({ event }) => {
  return (
    <div>
      <h2>Current Mining Event</h2>

      <MiningEventsTable pagination={false} events={[event]} />
    </div>
  );
};

export default CurrentMiningEvent;
