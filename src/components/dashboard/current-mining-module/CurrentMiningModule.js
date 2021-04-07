import React, { useState } from 'react';
import CurrentMiningEvent from './CurrentMiningEvent';
import CurrentEventFetch from './CurrentEventFetch';

const CurrentMiningModule = () => {
  const [currentEvent, setCurrentEvent] = useState();
  return (
    <div className="CurrentMining">
    <CurrentEventFetch setCurrentEvent={setCurrentEvent} />
    <CurrentMiningEvent currentEvent={currentEvent} />
    </div>
  );
};

export default CurrentMiningModule;
