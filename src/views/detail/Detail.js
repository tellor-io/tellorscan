import React, { useState, useEffect, useContext } from 'react';
import { useLocation,useHistory } from 'react-router-dom';
import { Button, Table, Collapse,Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { truncateAddr } from '../../utils/helpers';
import { chains } from '../../utils/chains';

import { GET_LATEST_EVENTS_BY_ID } from '../../utils/queries';
import {ReactComponent as Miner} from 'assets/miner.svg';
import { useMediaQuery } from 'react-responsive';
import { useAlert } from 'react-alert'

import { UserContext, setupUser } from 'contexts/User';
import { NetworkContext } from 'contexts/Network';

import AllEVentsOnIDTable from '../../components/detail/AllEVentsOnIDTable';
import GraphFetch from '../../components/shared/GraphFetch';


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
    const [processingTip, setProcessingTip] = useState();
    const [processingDispute, setProcessingDispute] = useState();

    const [currentTx, setCurrentTx] = useState();
    const [txLink, setTxLink] = useState(1);

    const [events, setEvents] = useState();


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



    const triggerDispute = async ({minerIndex,time}) => {
        console.log('minerIndex,time',minerIndex,time);
        setProcessingDispute(true);
        try {
          await currentUser.contracts.beginDispute(
            currentUser.address,
            priceData.id,
            time,
            minerIndex,
            setCurrentTx,
          );
        } catch (e) {
          console.error(`Error submitting dispute: ${e.toString()}`);
          setError(e);
        }
        setProcessingDispute(false);
    }




    
    const testarr = [
        {
            key:1,
            date: 1620276050,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:2,
            date: 1614980005,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:3,
            date: 1620276050,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:4,
            date: 1614980005,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:5,
            date: 1614980005,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:6,
            date: 1614980005,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:7,
            date: 1620276050,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:8,
            date: 1614980005,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:9,
            date: 1620276050,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:10,
            date: 1614980005,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:11,
            date: 1614980005,
            value: "1602,23",
            block:"(blocknr)"
        },
        {
            key:12,
            date: 1614980005,
            value: "1602,23",
            block:"(blocknr)"
        },
    ];

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
                            <p onClick={() => toggleOpenTipper(!openTipper)}>cancel</p >
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
                    <div>
                        <p>latest update in block</p>
                        <h2>(blocknr)</h2>
                    </div>
                    <div>
                        <p>current tip</p>
                        <h2>{priceData.tip}</h2>
                    </div>
                </div>

                <div className="Detail__Inner__LastMiners">
                    <p>latest update miner values</p>
                    {currentTx?
                        <a href={txLink+"tx/"+currentTx} target="_blank" rel="noopener noreferrer">Show tx on Etherscan</a>
                        :
                        null
                    }
                    <DetailMinerItem
                        address="0x1D39955c9662678535d68a966862A06956ea5196"
                        value="3469.92"
                        txLink={txLink}
                        triggerDispute={()=>toggleOpenDisputer(true)}/>
                    <DetailMinerItem
                        address="0x9G39955c9662678535d68a966862A06956ea5196"
                        value="3469.29"
                        txLink={txLink}
                        triggerDispute={()=>triggerDispute({minerIndex:2,time:priceData.timestamp})}/>
                    <DetailMinerItem
                        address="0x3F39955c9662678535d68a966862A06956ea5196"
                        value="3468.98"
                        txLink={txLink}
                        triggerDispute={()=>triggerDispute({minerIndex:3,time:priceData.timestamp})}/>
                    <DetailMinerItem
                        address="0x7739955c9662678535d68a966862A06956ea5196"
                        value="3470.00"
                        txLink={txLink}
                        triggerDispute={()=>triggerDispute({minerIndex:4,time:priceData.timestamp})}/>
                    <DetailMinerItem
                        address="0x2239955c9662678535d68a966862A06956ea5196"
                        value="3469.94"
                        txLink={txLink}
                        triggerDispute={()=>triggerDispute({minerIndex:5,time:priceData.timestamp})}/>
                </div>

                <div className="Detail__Inner__Section PriceEvolution">
                    <p>price evolution</p>
                    <p>t.d.b.</p>
                </div>

                <div className="Detail__Inner__Section AllMiningEventsOnID">
                    <p>all mining events on {priceData.name}</p>
                    <AllEVentsOnIDTable isMobile={isMobile} records={testarr}/>
                </div>


            </div>
            :
            "none found"
            }
{/* 
        <GraphFetch
        query={GET_LATEST_EVENTS_BY_ID}
        setRecords={setEvents}
        /> */}

        </div>
    )
}


const DetailMinerItem = ({address, value,txLink,triggerDispute}) => {
    const [openDisputer,toggleOpenDisputer] = useState(false);
    console.log(openDisputer);
    return (
        <div className="DetailMinerItem">
            <div className="DetailMinerItem__First">
            <Miner />
            <p><a href={txLink+"address/"+address} target="_blank" rel="noopener noreferrer">{truncateAddr(address)}</a> submitted {value}</p>
            {openDisputer?
            null 
            :
            <span className="DetailMinerItem__DisputeTrigger" onClick={() => toggleOpenDisputer(true)}>
                dispute value
            </span>
            }
            </div>
            <div className="disputeCollapser">
            <Collapse
                defaultActiveKey={['0']}
                activeKey={openDisputer ? ['1'] : ['0']}>
                    <Panel header="This is panel header 1" key="1">
                    <div>
                    <p onClick={() => toggleOpenDisputer(false)}>test</p>
                    </div>
                    </Panel>
            </Collapse>
            </div>
        </div>        
    );
}




export default Detail;
