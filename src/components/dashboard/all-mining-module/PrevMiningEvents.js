import React, { useState,useContext,useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Collapse } from 'antd';

import {ReactComponent as Miner} from 'assets/miner.svg';
import { getGranPrice } from 'utils/helpers';
import { truncateAddr } from 'utils/helpers';
import { UserContext, setupUser } from 'contexts/User';

import { NetworkContext } from 'contexts/Network';
import Disputer from '../../shared/Disputer';

// import MinerValuesModal from 'components/dashboard/current-mining-module/MinerValuesModal';

const { Panel } = Collapse;

const PrevMiningEvents = ({ miningEvent }) => {
    const [showMinerVals,setShowMinerVals] = useState([]);
    const [currentNetwork,setCurrentNetwork] = useContext(NetworkContext);
    const [currentUser, setCurrentUser] = useContext(UserContext);

    const [link,setLink] = useState();
    const isMobile = useMediaQuery({query: '(max-width: 680px)'});
    const [disputeCollapser,setDisputeCollapser] = useState("");

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


    const connectUser = () => {
        try {
            setupUser(setCurrentUser)
              .then(network => {
                setCurrentNetwork(network)
                alert.show("You are logged in to " + chains[network].network+". To login to a different network, switch the provider network.");
              })
          } catch (err) {
            console.log('login error', err);
          }
    }


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
                            <div key={j} className="PrevMiningEvent__MinerVal">
                            <div className="PrevMiningEvent__MinerVal__Inner">
                                <div>
                                {isMobile?
                                <>
                                    <Miner />
                                    <div className="mobileExtra">
                                        <p><a href={link+minerval.miner} target="_blank" rel="noopener noreferrer">{truncateAddr(minerval.miner)}</a> submitted</p>
                                        <p>{getGranPrice(minerval.values[i], requestId)}</p>
                                    </div>
                                </>
                                :
                                <>
                                    <Miner />
                                    <p><a href={link+minerval.miner} target="_blank" rel="noopener noreferrer">{truncateAddr(minerval.miner)}</a> submitted</p>
                                    <p>{getGranPrice(minerval.values[i], requestId)}</p>
                                </>
                                }
                                </div>
                                {parseInt(disputeCollapser, 10) === j?
                                null 
                                :
                                <p className="disputeClick" onClick={currentUser?() => setDisputeCollapser(j.toString()):() => connectUser()}>dispute value</p>}
                            </div>
                            <div className="disputeCollapser">
                                <Collapse
                                    activeKey={disputeCollapser}>
                                    <Panel header="This is panel header 1" key={j}>
                                        <Disputer
                                            id={requestId}
                                            minerAddr={minerval.miner}
                                            timestamp={miningEvent.timestamp}
                                            onCancel={() => setDisputeCollapser("")} />
                                    </Panel>
                                </Collapse>
                            </div>
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
