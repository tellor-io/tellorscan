import React, { useState } from 'react';
import styled from 'styled-components';

import { GET_ALL_EVENTS } from 'utils/queries';
import CurrentMiningEvent from 'components/mining-events/CurrentMiningEvent';
import AllMiningEvents from 'components/mining-events/AllMiningEvents';
import GraphFetch from 'components/shared/GraphFetch';
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

const Mining = () => {
  const [currentEvent, setCurrentEvent] = useState();
  const [events, setEvents] = useState();

  return (
    <StyledContainer>
      <CurrentEventFetch setCurrentEvent={setCurrentEvent} />
      <GraphFetch query={GET_ALL_EVENTS} setRecords={setEvents} />

      {currentEvent ? <CurrentMiningEvent currentEvent={currentEvent} /> : null}

      {events ? (
        <AllMiningEvents events={events.miningEvents.slice(1)} />
      ) : null}
    </StyledContainer>
  );
};

export default Mining;
