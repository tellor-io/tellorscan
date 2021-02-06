import React from 'react';

import MiningEventsTable from './MiningEventsTable';

const CurrentMiningEvent = ({ currentEvent }) => {
  return (
    <div className="CurrentEvent">
      <div className="TableHeader">
        <h2>Current Mining Event</h2>
      </div>

      { !currentEvent || currentEvent.noPending ? (<p className="fader" style={{ paddingLeft: '16px' }}>Fetching next request</p>)
        : (
          <MiningEventsTable
            pagination={false}
            events={[currentEvent]}
            current={true}
          />
        )
      }

    </div>
  );
};

export default CurrentMiningEvent;
