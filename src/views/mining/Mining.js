import React, { useState } from 'react';

import { GET_ALL_EVENTS } from 'utils/queries';
import CurrentMiningEvent from 'components/mining-events/CurrentMiningEvent';
import AllMiningEvents from 'components/mining-events/AllMiningEvents';
import GraphFetch from 'components/shared/GraphFetch';
import CurrentEventFetch from 'components/mining-events/CurrentEventFetch';


const Mining = () => {
  const [currentEvent, setCurrentEvent] = useState();
  const [events, setEvents] = useState();

  return (
    <>
      <GraphFetch
        query={GET_ALL_EVENTS}
        setRecords={setEvents}
      />

      <CurrentEventFetch setCurrentEvent={setCurrentEvent} />
      <div className="Hero">
        <div className="View">
          <CurrentMiningEvent currentEvent={currentEvent} />
        </div>
      </div>

      {events ? (
        <div className="View">
          <AllMiningEvents events={events.miningEvents} />
        </div>
      ) : null}
    </>
  );
};

export default Mining;
