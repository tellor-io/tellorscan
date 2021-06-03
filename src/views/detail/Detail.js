import React, { useState, useEffect, useContext } from 'react';
import { useLocation,useHistory } from 'react-router-dom';
import { Button, Table, Collapse,Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { truncateAddr,getGranPrice } from '../../utils/helpers';
import { chains } from '../../utils/chains';

import { GET_LATEST_EVENTS_BY_ID } from '../../utils/queries';
import {ReactComponent as Miner} from 'assets/miner.svg';
import { useMediaQuery } from 'react-responsive';
import { useAlert } from 'react-alert'

import { UserContext, setupUser } from 'contexts/User';
import { NetworkContext } from 'contexts/Network';

import AllEVentsOnIDTable from '../../components/detail/AllEVentsOnIDTable';
import GraphFetch from '../../components/shared/GraphFetch';
import Disputer from '../../components/shared/Disputer';


const { Panel } = Collapse;

const Detail = ({ prices }) => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    const location = useLocation();
    const history = useHistory();
    const isMobile = useMediaQuery({query: '(max-width: 680px)'});
    const key = location.pathname.split('/')[2];
    const [priceData,setPriceData] = useState(null);
    const [openTipper,toggleOpenTipper] = useState(false);
    const [tipAmount,setTipAmount] = useState(null);
    const [currentUser, setCurrentUser] = useContext(UserContext);
    const [currentNetwork,setCurrentNetwork] = useContext(NetworkContext);
    const alert = useAlert()
    const [error, setError] = useState();
    const [currentTx, setCurrentTx] = useState();
    const [txLink, setTxLink] = useState(1);
    const [newEvents, setNewEvents] = useState();
    const [latestEvent, setLatestEvent] = useState();
    const [allEvents, setAllEvents] = useState();

    useEffect(() => {
        if(currentNetwork){
            if(currentNetwork === 1){
                setTxLink("https://etherscan.io/")
            }
            if(currentNetwork === 4){
                setTxLink("https://rinkeby.etherscan.io/")
            }
        }
    },[currentNetwork]);


    useEffect(() => {
        if(newEvents && newEvents.miningEvents){
            const allevents = newEvents.miningEvents.map((event,i) => {
                return({
                    key:i,
                    minerValues:event.minerValues,
                    value: event.granPrices[event.requestIds.indexOf(priceData.id)],
                    inDisputeWindow:event.inDisputeWindow,
                    id:priceData.id,
                    date:event.timestamp,
                    blockNumber:event.blockNumber,
                    idIndex: event.requestIds.indexOf(priceData.id),
                    txLink:txLink
                });
            })
            setAllEvents(allevents)
        }
        if(newEvents && newEvents.miningEvents && priceData && priceData.id){
            const latestevent = newEvents.miningEvents[0].minerValues.map((event,i) => {
                return({
                    miner:event.miner,
                    value: getGranPrice(event.values[newEvents.miningEvents[0].requestIds.indexOf(priceData.id)],priceData.id),
                    inDisputeWindow:newEvents.miningEvents[0].inDisputeWindow,
                    id:priceData.id
                });
            })
            setLatestEvent(latestevent)
        }
    },[newEvents,priceData]);



    const doTipping = async () => {
        setProcessingTip(true);
        try {
          setError()
          if (!isTipValid(tipAmount)) {
            setError("invalid tip amount")
          } else {
            await currentUser.contracts.addTip(
              {
                from: currentUser.address,
                id: priceData.id,
                amount: tipToWei(tipAmount),
                setTx: setCurrentTx
              })
          }
        } catch (e) {
          console.error(`Error adding tip: ${e.toString()}`);
          setError(e);
        }
        setProcessingTip(false);
      };


    const isTipValid = (val) => {
        const numericTip = parseFloat(val.replaceAll(',', '.'));
        return !isNaN(numericTip) && numericTip > 0;
    }

    const tipToWei = (val) => {
        return currentUser.web3.utils.toWei(val.replaceAll(',', '.'), 'ether');
    }



    const triggerDispute = async ({minerIndex,timestamp}) => {
        setProcessingDispute(true);
        try {
          await currentUser.contracts.beginDispute(
            currentUser.address,
            priceData.id,
            timestamp,
            minerIndex,
            setCurrentTx,
          );
        } catch (e) {
          console.error(`Error submitting dispute: ${e.toString()}`);
          setError(e);
        }
        setProcessingDispute(false);
    }


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

    useEffect(() => {
        let pricesfiltered;
        if(key && prices) {
            for (var i=0; i < prices.length; i++) {
                if (prices[i].id === key) {
                    pricesfiltered = prices[i];
                }
            }
            const date = new Date(pricesfiltered.timestamp * 1000).toLocaleString();
            setPriceData({
                ...priceData,
                id: pricesfiltered.id,
                name: pricesfiltered.name,
                timestamp: pricesfiltered.timestamp,
                date: date,
                tip: pricesfiltered.tip,
                value: pricesfiltered.value
            });
        }
    },[key,prices]);


    return(
        <div className="Detail">
            <Button className="backbutton" onClick={() => history.push("/")}><LeftOutlined /> Back to overview</Button>
            {priceData?
            <div className="Detail__Inner">
                <div className="Detail__Inner__Top">
                    <div>
                        <h1>{priceData.name}</h1>
                        <p>ID {priceData.id}</p>
                    </div>
                    <div className="flexer">
                    </div>
                    {openTipper?
                    null
                    :
                    <Button onClick={currentUser?() => toggleOpenTipper(!openTipper):() => connectUser()}>Tip ID</Button>
                    }
                </div>
                <div className="Detail__Inner__Section tipCollapser">
                    <Collapse
                        defaultActiveKey={['0']}
                        activeKey={openTipper ? ['1'] : ['0']}>
                        <Panel header="This is panel header 1" key="1">
                        <div>
                            <p>How much do you want to tip this ID ({priceData.name})?</p>
                            <Input
                                size="large"
                                placeholder="TIP amount"
                                suffix={"TRB"}
                                type="number"
                                onChange={(e) => setTipAmount(e.target.value)}/>
                        </div>
                        <div>
                            <div>
                            <p className="onCancel" onClick={() => toggleOpenTipper(!openTipper)}>cancel</p >
                            <Button disabled={!tipAmount} onClick={() => doTipping()}>Tip ID</Button>
                            </div>
                            {currentTx?
                                <a href={txLink+"tx/"+currentTx} target="_blank" rel="noopener noreferrer">Show tx on Etherscan</a>
                                :
                                null
                            }
                        </div>
                        </Panel>
                    </Collapse>
                </div>
                <div className="Detail__Inner__Section LastConfVal">
                    <p>latest confirmed value</p>
                    <div>
                        <h1>{priceData.value}</h1>
                        <p>USD</p>
                    </div>
                </div>

                <div className="Detail__Inner__Section UpdateBlockTip">
                    <div>
                        <p>latest update</p>
                        <h2>{priceData.date}</h2>
                    </div>
                    {newEvents && newEvents.miningEvents[0]?
                    <div>
                        <p>latest update in block</p>
                        <h2>{newEvents.miningEvents[0].blockNumber}</h2>
                    </div>
                    : null }
                    <div>
                        <p>current tip</p>
                        <h2>{priceData.tip}</h2>
                    </div>
                </div>

                <div className="Detail__Inner__LastMiners">
                    <p>latest update miner values</p>
                    {/* {currentTx?
                        <a href={txLink+"tx/"+currentTx} target="_blank" rel="noopener noreferrer">Show tx on Etherscan</a>
                        :
                        null
                    } */}

                    {latestEvent ?
                    <>
                    {latestEvent.map((latestminer,i)=>{
                        return <DetailMinerItem
                            key={i}
                            miner={latestminer.miner}
                            value={latestminer.value}
                            inDisputeWindow={latestminer.inDisputeWindow}
                            txLink={txLink}
                            currentUser={currentUser}
                            id={priceData.id}
                            minerIndex={i}
                            timestamp={priceData.timestamp}
                            connectUser={() => connectUser()}
                            triggerDispute={currentUser?()=>toggleOpenDisputer(true):() => connectUser()}/>
                    })}
                    </>
                    : null }
                </div>

                {/* 
                    TO BE ADDED LATER !! :::

                    <div className="Detail__Inner__Section PriceEvolution">
                        <p>price evolution</p>
                        <p>t.d.b.</p>
                    </div> */}

                <div className="Detail__Inner__Section AllMiningEventsOnID">
                    <p>all mining events on {priceData.name}</p>
                    <AllEVentsOnIDTable isMobile={isMobile} records={allEvents}/>
                </div>


            </div>
            :
            "none found"
            }
        {priceData?
        <GraphFetch
        query={GET_LATEST_EVENTS_BY_ID(priceData.id)}
        setRecords={setNewEvents}
        />
        :null}

        </div>
    )
}


const DetailMinerItem = ({id,timestamp,miner,value,inDisputeWindow,txLink,currentUser,connectUser}) => {
    const [openDisputer,toggleOpenDisputer] = useState(false);
    return (
        <div className="DetailMinerItem">
            <div className="DetailMinerItem__First">
            <Miner />
            <p><a href={txLink+"address/"+miner} target="_blank" rel="noopener noreferrer">{truncateAddr(miner)}</a> submitted {value}</p>
            {openDisputer?
            null 
            :
            <>
            {inDisputeWindow?
            <span className="DetailMinerItem__DisputeTrigger" onClick={currentUser?() => toggleOpenDisputer(true):connectUser}>
                dispute value
            </span>
            :
            <small className="DetailMinerItem__OutofWindow">Out of dispute window</small>
            }
            </>
            }
            </div>
            <div className="disputeCollapser">
                <Collapse
                    defaultActiveKey={['0']}
                    activeKey={openDisputer ? ['1'] : ['0']}>
                    <Panel header="This is panel header 1" key="1">
                        <Disputer
                        id={id}
                        minerAddr={miner}
                        timestamp={timestamp}
                        onCancel={() => toggleOpenDisputer(false)} />
                    </Panel>
                </Collapse>
            </div>
        </div>        
    );
}




export default Detail;
