import React, { useState, useEffect } from 'react';
import { useLocation,useHistory } from 'react-router-dom';
import { Button, Table, Collapse,Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { truncateAddr } from '../../utils/helpers';
import {ReactComponent as Miner} from 'assets/miner.svg';
import { useMediaQuery } from 'react-responsive';
// import { isMobile } from 'web3modal';

const { Panel } = Collapse;

const Detail = ({ events, prices }) => {
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
    let eventsfiltered;
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
            date: date,
            tip: pricesfiltered.tip,
            value: pricesfiltered.value
        });
    }
    if(key && events && events.miningEvents) {
        for (var i=0; i < events.miningEvents.length; i++) {
            const test  = events.miningEvents[i].requestIds;
            for (var j=0; j < events.miningEvents[i].requestIds.length; j++) {
                if(events.miningEvents[i].requestIds[j] === key) {
                    console.log("whatwhat");
                }
            }
        }
    }


    },[key,events,prices]);


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
                    <Button onClick={() => toggleOpenTipper(!openTipper)}>Tip ID</Button>
                    }
                </div>
                <div className="Detail__Inner__Section tipCollapser">
                    <Collapse
                        defaultActiveKey={['0']}
                        activeKey={openTipper ? ['1'] : ['0']}>
                        <Panel header="This is panel header 1" key="1">
                        <div>
                            <p>How much do you want to tip ID {priceData.id} ({priceData.name})?</p>
                            <Input
                                size="large"
                                placeholder="TIP amount"
                                suffix={"ETH"}
                                type="number"
                                onChange={(e) => setTipAmount(e.target.value)}/>
                        </div>
                        <div>
                            <p onClick={() => toggleOpenTipper(!openTipper)}>cancel</p >
                            <Button disabled={!tipAmount} onClick={() => toggleOpenTipper(!openTipper)}>Tip ID</Button>
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
                    <DetailMinerItem address="0x1D39955c9662678535d68a966862A06956ea5196" value="3469.92"/>
                    <DetailMinerItem address="0x9G39955c9662678535d68a966862A06956ea5196" value="3469.29"/>
                    <DetailMinerItem address="0x3F39955c9662678535d68a966862A06956ea5196" value="3468.98"/>
                    <DetailMinerItem address="0x7739955c9662678535d68a966862A06956ea5196" value="3470.00"/>
                    <DetailMinerItem address="0x2239955c9662678535d68a966862A06956ea5196" value="3469.94"/>
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
        </div>
    )
}


const DetailMinerItem = ({address, value}) => {
    return (
        <div className="DetailMinerItem">
            <Miner />
            <p><a href={"https://etherscan.io/address/"+address} target="_blank" rel="noopener noreferrer">{truncateAddr(address)}</a> submitted {value}</p>
            <span className="DetailMinerItem__DisputeTrigger">
                dispute value
            </span>
        </div>
    );
}

const AllEVentsOnIDTable = ({records,isMobile}) => {
    let columns;
    if(isMobile){
        columns = [
            {
            title: 'date',
            dataIndex: 'date',
            key: 'date',
            width:'50%',
            sorter: (a, b) => a.date - b.date,
            render: (date) => {
                const humandate = new Date(date * 1000).toLocaleString();
                return(
                    <>{humandate}</>
                )},
            },
            {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
            width:'50%',
            sorter: (a, b) => a.value - b.value,
            render: (value) => <>{value} USD</>,
            },
        ];
    } else {
        columns = [
            {
              title: 'date',
              dataIndex: 'date',
              key: 'date',
              width:'30%',
              sorter: (a, b) => a.date - b.date,
              render: (date) => {
                const humandate = new Date(date * 1000).toLocaleString();
                return(
                    <>{humandate}</>
                )},
            },
            {
              title: 'value',
              dataIndex: 'value',
              key: 'value',
              width:'33%',
              sorter: (a, b) => a.value - b.value,
              render: (value) => <>{value} USD</>,
            },
            {
              title: 'block',
              dataIndex: 'block',
              key: 'block',
              width:'33%',
              sorter: (a, b) => a.block - b.block
            },
        ];
      }

    return (
        <div className="AllEVentsOnIDTable">
            <Table
                dataSource={records}
                columns={columns}
                expandRowByClick={true}
                expandIconColumnIndex={4}
                expandedRowRender={(record, index) => {
                      return <p key={index}>
                        {isMobile?
                        <><p>{record.value}</p></>
                        :
                        <><p>Desktop</p></>
                        }</p>;
                  }}
                   />
        </div>
    );
}


export default Detail;
