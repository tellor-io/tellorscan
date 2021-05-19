import React, { useState,useContext,useEffect } from 'react';
import { Collapse } from 'antd';

import {ReactComponent as Miner} from 'assets/miner.svg';
import { getGranPrice } from 'utils/helpers';
import { truncateAddr } from 'utils/helpers';
import { NetworkContext } from 'contexts/Network';

// import MinerValuesModal from 'components/dashboard/current-mining-module/MinerValuesModal';

const { Panel } = Collapse;

const PrevMiningEvents = ({ miningEvent }) => {
    const [showMinerVals,setShowMinerVals] = useState([]);
    const [currentNetwork] = useContext(NetworkContext);
    const [link,setLink] = useState();

    const addtoShowMinerVals = (e) => {
        const arr = [...showMinerVals];
        if(arr.includes(e)){
            const index = arr.indexOf(e);
            if (index > -1) {
                arr.splice(index, 1);
            }
        } else {
            arr.push(e);
        }
        setShowMinerVals(arr);
    }

    useEffect(() => {
        if(currentNetwork) {
            if(currentNetwork === 1) {
                setLink("https://etherscan.io/address/");
            }
            if(currentNetwork === 4) {
                setLink("https://rinkeby.etherscan.io/address/");
            }
        }
    },[currentNetwork])

    console.log("showMinerVals",showMinerVals);
    console.log("currentNetwork",currentNetwork)
  return(
    <div className="PrevMiningEvents">{miningEvent.requestIds.map((requestId, i) => {
        return (
            <div className="PrevMiningEvent" key={i}>
                <div className="PrevMiningEvent__Inner" key={i}>
                    <div>
                        <p>{miningEvent.requestSymbols[i]}</p>
                        <p>{getGranPrice(miningEvent.minedValues[i], requestId)}</p>
                    </div>
                    <p className="ShowMinerValues" onClick={() => addtoShowMinerVals(i)}>{showMinerVals.includes(i)?"hide":"miner values"}</p>
                </div>
                <Collapse
                activeKey={showMinerVals}>
                    <Panel header="Bracket panel" key={i}>
                    {miningEvent.minerValues.map((minerval,j) => {
                        return (
                        <div className="PrevMiningEvent__MinerVal">
                            <div>
                                <Miner />
                                <p><a href={link+minerval.miner} target="_blank" rel="noopener noreferrer">{truncateAddr(minerval.miner)}</a> submitted</p>
                                <p>{getGranPrice(minerval.values[i], requestId)}</p>
                            </div>
                            <p><span className="bold">dispute value</span></p>
                        </div>
                        )
                    })}
                    </Panel>
                </Collapse>

            </div>
        )
    })}</div>
  )
};

export default PrevMiningEvents;
