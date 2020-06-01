import React, { useState } from 'react';
import styled from 'styled-components';

import { GET_LATEST_EVENTS, GET_LATEST_DISPUTES } from 'utils/queries';
import CurrentMiningEvent from 'components/mining-events/CurrentMiningEvent';
import RecentMiningEvents from 'components/mining-events/RecentMiningEvents';
import GraphFetch from 'components/shared/GraphFetch';
import RecentDisputes from 'components/disputes/RecentDisputes';
import CurrentEventFetch from 'components/mining-events/CurrentEventFetch';
import OpenDisputesFetch from 'components/disputes/OpenDiputesFetch';

const Home = () => {
  const [currentEvent, setCurrentEvent] = useState();
  const [events, setEvents] = useState();
  const [disputes, setDisputes] = useState();

  return (
    <>
      <CurrentEventFetch setCurrentEvent={setCurrentEvent} />
      <OpenDisputesFetch />
      <GraphFetch
        query={GET_LATEST_EVENTS}
        setRecords={setEvents}
        suppressLoading={true}
      />
      <GraphFetch
        query={GET_LATEST_DISPUTES}
        setRecords={setDisputes}
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
          <RecentMiningEvents events={events.miningEvents.slice(1)} />
        </div>
      ) : null}

      {disputes ? (
        <div className="View">
          <RecentDisputes disputes={disputes.disputes} />
        </div>
      ) : null}
    </>
  );
};

export default Home;
