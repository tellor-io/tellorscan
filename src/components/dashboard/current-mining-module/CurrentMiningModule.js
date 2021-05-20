import React, { useState } from 'react';
import CurrentMiningEvent from './CurrentMiningEvent';
import CurrentEventFetch from './CurrentEventFetch';

const CurrentMiningModule = () => {
  const [currentEvent, setCurrentEvent] = useState();
  return (
    <div className="CurrentMining">
      <CurrentEventFetch setCurrentEvent={setCurrentEvent} />
      <CurrentMiningEvent currentEvent={currentEvent} />
      <div className="CurrentMining__MinersBox">
        <div>
          <p>Staked miners</p>
          <h2>55</h2>
        </div>
        {currentEvent && currentEvent.minerValues ?
        <div>
          <p>Block winners</p>
          <h2>{currentEvent.minerValues.length}/5</h2>
        </div>
        : null }
      </div>
    </div>
  );
};

export default CurrentMiningModule;
