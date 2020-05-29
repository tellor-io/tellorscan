import React, { useState } from 'react';
import styled from 'styled-components';

import { GET_LATEST_EVENTS, GET_LATEST_DISPUTES } from 'utils/queries';
import CurrentMiningEvent from 'components/mining-events/CurrentMiningEvent';
import RecentMiningEvents from 'components/mining-events/RecentMiningEvents';
import GraphFetch from 'components/shared/GraphFetch';
import RecentDisputes from 'components/disputes/RecentDisputes';
import CurrentEventFetch from 'components/mining-events/CurrentEventFetch';

const StyledContainer = styled.div`
  // display: flex;
  // align-items: center;
  // flex-direction: column;
  width: calc(100%);
  max-width: 1200px;
  position: relative;
  margin: 0 auto;
  padding-bottom: 75px;
`;

const Home = () => {
  const [currentEvent, setCurrentEvent] = useState();
  const [events, setEvents] = useState();
  const [disputes, setDisputes] = useState();

  return (
    <StyledContainer>
      <CurrentEventFetch setCurrentEvent={setCurrentEvent} />
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

      {currentEvent ? <CurrentMiningEvent currentEvent={currentEvent} /> : null}

      {events ? (
        <RecentMiningEvents events={events.miningEvents.slice(1)} />
      ) : null}

      {disputes ? <RecentDisputes disputes={disputes.disputes} /> : null}
    </StyledContainer>
  );
};

export default Home;
