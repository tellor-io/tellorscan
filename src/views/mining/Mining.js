import React, { useState } from 'react';

import { GET_ALL_EVENTS } from 'utils/queries';
import CurrentMiningEvent from 'components/mining-events/CurrentMiningEvent';
import AllMiningEvents from 'components/mining-events/AllMiningEvents';
import GraphFetch from 'components/shared/GraphFetch';
import CurrentEventFetch from 'components/mining-events/CurrentEventFetch';
import OpenDisputesFetch from 'components/disputes/OpenDiputesFetch';
import VotingOn from 'components/votes/VotingOn';

const Mining = () => {
  const [currentEvent, setCurrentEvent] = useState();
  const [events, setEvents] = useState();

  return (
    <>
    <div className="Hero">
      <div className="View">
        <h1 style={{fontSize:60, alignContent: "center"}}>
          Tellor 2.5 Proposal
        </h1>
        <a>
        TLDR:
        Staking reduced from 1000 TRB to 500 TRB 
        Current miner reward changed fron 1 TRB + tips to 1 TRB + tips + timeSinceLastMineValue/5Min\n\n\n
        </a>
      <VotingOn />

      </div>
    </div>
      {/* <OpenDisputesFetch />
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
          <AllMiningEvents events={events.miningEvents} />
        </div>
      ) : null} */}
    </>
  );
};

export default Mining;
