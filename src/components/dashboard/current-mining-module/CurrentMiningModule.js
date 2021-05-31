import React, { useState, useEffect, useContext } from 'react';
import CurrentMiningEvent from './CurrentMiningEvent';
import CurrentEventFetch from './CurrentEventFetch';
import { NetworkContext } from 'contexts/Network';
import { chains } from 'utils/chains';

const CurrentMiningModule = () => {
  const [currentEvent, setCurrentEvent] = useState();
  const [stakeCount, setStakeCount] = useState();
  const [currentNetwork] = useContext(NetworkContext);


  useEffect(() => {
    fetch(chains[currentNetwork].apiURL + "/info")
      .then(response => response.json())
      .then(data =>
        setStakeCount(data.stakerCount)
      );
  }, [])


  return (
    <div className="CurrentMining">
      <CurrentEventFetch setCurrentEvent={setCurrentEvent} />
      <CurrentMiningEvent currentEvent={currentEvent} />
      <div className="CurrentMining__MinersBox">
        <div>
          <p>Staked miners</p>
          <h2>{stakeCount?stakeCount:null}</h2>
        </div>
        <div>
          <p>Block winners</p>
          <h2>{currentEvent && currentEvent.minerValues ?currentEvent.minerValues.length:"0"}/5</h2>
        </div>
      </div>
    </div>
  );
};

export default CurrentMiningModule;
