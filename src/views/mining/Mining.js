import React, { useState } from 'react';

import { GET_ALL_EVENTS } from 'utils/queries';
import CurrentMiningEvent from 'components/mining-events/CurrentMiningEvent';
import AllMiningEvents from 'components/mining-events/AllMiningEvents';
import GraphFetch from 'components/shared/GraphFetch';
import CurrentEventFetch from 'components/mining-events/CurrentEventFetch';
import OpenDisputesFetch from 'components/disputes/OpenDiputesFetch';

const Mining = () => {
  const [currentEvent, setCurrentEvent] = useState();
  const [events, setEvents] = useState();

  return (
    <>
      <OpenDisputesFetch />
      <CurrentEventFetch setCurrentEvent={setCurrentEvent} />
      <GraphFetch
        query={GET_ALL_EVENTS}
        setRecords={setEvents}
        suppressLoading={true}
      />

      {currentEvent ? (
        <div className="Hero">
          <div className="View">
            <CurrentMiningEvent currentEvent={currentEvent} />
          </div>
        </div>
      ) : null}

      {events ? (
        <div className="View">
          <AllMiningEvents events={events.miningEvents.slice(1)} />
        </div>
      ) : null}
    </>
  );
};

export default Mining;
