import React, { useState } from 'react';

import { GET_ALL_EVENTS } from 'utils/queries';
import CurrentMiningEvent from 'components/mining-events/CurrentMiningEvent';
import AllMiningEvents from 'components/mining-events/AllMiningEvents';
import GraphFetch from 'components/shared/GraphFetch';
import CurrentEventFetch from 'components/mining-events/CurrentEventFetch';
import OpenDisputesFetch from 'components/disputes/OpenDiputesFetch';
import VoteForm from 'components/votes/VoteForm';

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
        <p>
        TLDR:
        Staking reduced from 1000 TRB to 500 TRB 
        Current miner reward changed fron 1 TRB + tips to 1 TRB + tips + timeSinceLastMineValue/5Min
        </p>
      <div style={{margin:20}}>

      <VoteForm dispute={{disputeId
        : 46}} />
      </div>
         <p><a href={"https://github.com/tellor-io/TIPs/blob/main/TIPs/TIP-2%20Tellor2.5.md"}> See Full Proposal </a></p>
      </div>
    </div>
    </>
  );
};

export default Mining;
