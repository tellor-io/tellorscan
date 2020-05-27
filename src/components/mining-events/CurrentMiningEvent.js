import React from 'react';
import _ from 'lodash';

import MiningEventsTable from './MiningEventsTable';

const CurrentMiningEvent = ({ currentEvent }) => {
  console.log('currentEvent', currentEvent);
  return (
    <>
      <div className="TableHeader">
        <h2>Current Mining Event</h2>
      </div>

      {currentEvent.noPending ? (
        <p>No current requests</p>
      ) : (
        <MiningEventsTable pagination={false} events={[currentEvent]} />
      )}
    </>
  );
};

export default CurrentMiningEvent;
