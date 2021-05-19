import React, {useState, useEffect} from 'react';
import CurrentMiner from './CurrentMiner';
import CurrentMiningSVGs from './CurrentMiningSVGs';
import { useMediaQuery } from 'react-responsive';

const CurrentMiningEvent = ({ currentEvent }) => {
  const isSmallVisual = useMediaQuery({query: '(max-width: 1200px)'});

  const [symbols, setSymbols] = useState();
  const [miners, setMiners] = useState({
    miner1: false,
    miner2: false,
    miner3: false,
    miner4: false,
    miner5: false,
  })
  useEffect(()=>{
    if(currentEvent && currentEvent.minerValues){
      setSymbols(currentEvent.minerValues[0].requestSymbols.join(", "));
      setMiners({
        miner1: currentEvent.minerValues[0] ? currentEvent.minerValues[0].miner : false,
        miner2: currentEvent.minerValues[1] ? currentEvent.minerValues[1].miner : false,
        miner3: currentEvent.minerValues[2] ? currentEvent.minerValues[2].miner : false,
        miner4: currentEvent.minerValues[3] ? currentEvent.minerValues[3].miner : false,
        miner5: currentEvent.minerValues[4] ? currentEvent.minerValues[4].miner : false,
      }) 
    }
  },[currentEvent]);

  return (
    <>
      { !currentEvent || currentEvent.noPending ?
        (
        <div className="CurrentMiningVisual">
            <CurrentMiner miner={miners.miner1} minerstyle="first" />
            <CurrentMiner miner={miners.miner2} minerstyle="second" />
            <CurrentMiner miner={miners.miner3} minerstyle="third" />
            <CurrentMiner miner={miners.miner4} minerstyle="fourth" />
            <CurrentMiner miner={miners.miner5} minerstyle="fifth" />
            <p>Fetching next request</p>
            <CurrentMiningSVGs.Circle fill="#D9D9D9" className="circle"/>
        </div>
        )
        : (
          <div className="CurrentMiningVisual">
              <CurrentMiner miner={miners.miner1} loading={!miners.miner1} minerstyle="first" />
              <CurrentMiner miner={miners.miner2} loading={miners.miner1 && !miners.miner2} minerstyle="second" />
              <CurrentMiner miner={miners.miner3} loading={miners.miner2 && !miners.miner3} minerstyle="third" />
              <CurrentMiner miner={miners.miner4} loading={miners.miner3 && !miners.miner4} minerstyle="fourth" />
              <CurrentMiner miner={miners.miner5} loading={miners.miner4 && !miners.miner5} minerstyle="fifth" />
              <div className="midblock">
                <p>tellor network is <br />currently mining:</p>
                <p>{symbols}</p>
              </div>
              <CurrentMiningSVGs.Circle fill="#D9D9D9" className="circle"/>
          </div>

        )
      }
    </>
  );
};

export default CurrentMiningEvent;
