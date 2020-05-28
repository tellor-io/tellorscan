import React from 'react';
import _ from 'lodash';

import MiningEventsTable from './MiningEventsTable';

const CurrentMiningEvent = ({ currentEvent }) => {
  return (
    <div className="CurrentEvent">
      <div className="TableHeader">
        <h2>Current Mining Event</h2>
      </div>

      {currentEvent.noPending ? (
        <p style={{ paddingLeft: '16px' }}>No current requests</p>
      ) : (
        <MiningEventsTable pagination={false} events={[currentEvent]} />
      )}
    </div>
  );
};

export default CurrentMiningEvent;
