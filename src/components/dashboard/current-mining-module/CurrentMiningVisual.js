import React, {useState, useEffect} from 'react';
import CurrentMiner from './CurrentMiner';
import CurrentMiningSVGs from './CurrentMiningSVGs';


const CurrentMiningVisual = ({ currentEvent }) => {
  const [miners, setMiners] = useState({
    miner1: false,
    miner2: false,
    miner3: false,
    miner4: false,
    miner5: false,
  })
  useEffect(()=>{
    if(currentEvent && currentEvent.minerValues){
      setMiners({
        miner1: currentEvent.minerValues[0] ? currentEvent.minerValues[0].miner : false,
        miner2: currentEvent.minerValues[1] ? currentEvent.minerValues[1].miner : false,
        miner3: currentEvent.minerValues[2] ? currentEvent.minerValues[2].miner : false,
        miner4: currentEvent.minerValues[3] ? currentEvent.minerValues[3].miner : false,
        miner5: currentEvent.minerValues[4] ? currentEvent.minerValues[4].miner : false,
      }) 
    }
  },[currentEvent]);
  console.log("currentEvent in CurrentMiningVisual",currentEvent);

  return (
    <>
      { !currentEvent || currentEvent.noPending ?
        (
        <div className="CurrentMiningVisual">
            <p>Fetching next request</p>
            <CurrentMiningSVGs.Circle fill="#C7C7C7"/>
        </div>
        )
        : (
          <div className="CurrentMiningVisual">
              <CurrentMiner miner={miners.miner1} />
              <CurrentMiner miner={miners.miner2} />
              <CurrentMiner miner={miners.miner3} />
              <CurrentMiner miner={miners.miner4} />
              <CurrentMiner miner={miners.miner5} />
              <CurrentMiningSVGs.Circle fill="#C7C7C7"/>
          </div>

        )
      }
    </>
  );
};

export default CurrentMiningVisual;
