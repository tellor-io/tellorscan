import React, { useState } from 'react';
import { GET_ALL_EVENTS } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import MiningEventsTable from './MiningEventsTable';

const AllMiningModule = () => {
    const [events, setEvents] = useState();
  return (
    <div className="AllMining">
    <GraphFetch
        query={GET_ALL_EVENTS}
        setRecords={setEvents}
      />
    {events ? (
          <MiningEventsTable pagination={true} events={events.miningEvents} />
      ) : null}
    </div>
  );
};

export default AllMiningModule;
