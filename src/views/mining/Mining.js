import React, { useState } from 'react';
import styled from 'styled-components';

import { GET_ALL_EVENTS } from 'utils/queries';
import CurrentMiningEvent from 'components/mining-events/CurrentMiningEvent';
import AllMiningEvents from 'components/mining-events/AllMiningEvents';
import GraphFetch from 'components/shared/GraphFetch';
import CurrentEventFetch from 'components/mining-events/CurrentEventFetch';

const StyledContainer = styled.div`
  display: flex;
  align-items: left;
  flex-direction: column;
  padding: 50px;
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
