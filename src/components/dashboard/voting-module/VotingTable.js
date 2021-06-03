import React, { useState,useEffect, useContext } from 'react';
import { Table } from 'antd';
import { getGranPrice,truncateAddr } from 'utils/helpers';
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';
import { NetworkContext } from 'contexts/Network';
import { useMediaQuery } from 'react-responsive';

const VotingTable = ({ votes, pagination }) => {
  const [txLink, setTxLink] = useState(1);
  const [currentNetwork] = useContext(NetworkContext);
  const isMobile = useMediaQuery({query: '(max-width: 680px)'});

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

  const copy = isMobile? 'value': 'disputed value';
  const columns = [
    {
      title: copy,
      width:'50%',
      render: (record) => {
        return <p className="bold">{getGranPrice(record.value,record.id)+" ("+record.requestSymbol+")"}</p>;
      },
    },
    {
      title: 'disputed on',
      width:'50%',
      render: (record) => {
        const humandate = new Date(record.timestamp * 1000).toLocaleString();
        return <>{humandate}</>;
      },
    },
  ];

  return (
    <>
    {votes?
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={votes}
      pagination={pagination}
      expandRowByClick={true}
      expandIconColumnIndex={3}
      expandedRowRender={(record, index) => {
            return <div className="pastdispute_box" key={index}>
              <div><p>Value submitted by <a href={txLink+"address/"+record.miner} target="_blank" rel="noopener noreferrer">{truncateAddr(record.miner)}</a></p></div>
              <div><p>Total votes: {record.votes? record.votes.length: "0"}</p></div>
              <div className={record.result? "green bold":"bold"}><p>{record.result? <CheckOutlined />:<CloseOutlined />} Dispute {record.result? "Passed":"Rejected"}</p></div>

              </div>
          }}
    />
    : null }
    </>
  );
};

export default VotingTable;
