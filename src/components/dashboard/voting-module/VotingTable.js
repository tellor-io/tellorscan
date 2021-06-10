import React, { useState,useEffect, useContext } from 'react';
import { Table } from 'antd';
import { fromWei, getGranPrice,truncateAddr } from 'utils/helpers';
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';
import { NetworkContext } from 'contexts/Network';
import { useMediaQuery } from 'react-responsive';
import GraphFetch from 'components/shared/GraphFetch';
import { GET_VOTES } from 'utils/queries';

const VotingTable = ({ votes, pagination }) => {
  const [voteFeed, setVoteFeed] = useState();

  GraphFetch({ query: GET_VOTES, setRecords: setVoteFeed, suppressLoading: true })
  const VotesPerDisputeTable = ({ voteFeed, record }) => {
    const columns = [
      { title: 'Date', dataIndex: 'timestamp', key: 'timestamp', render: ((timestamp) => (new Date(timestamp * 1000).toISOString())) },
      { title: 'Voter', dataIndex: 'voter', key: 'voter' },
      { title: 'Vote Position', dataIndex: 'position', key: 'position', render: ((position) => position ? "Pass" : "Deny") },
      { title: 'Vote Weight', dataIndex: 'voteWeight', key: 'voteWeight', align: 'left', render: ((voterWeight) => fromWei(voterWeight)) },
    ];
    let inTable = voteFeed.filter(function (entry) {
      return entry.disputeId === record.id
    });
    return (
      <Table columns={columns}
        dataSource={inTable}
        pagination={false}
        rowKey={'disputeId'}
      />
    );
  };
  const [txLink, setTxLink] = useState(1);
  const [currentNetwork] = useContext(NetworkContext);
  const isMobile = useMediaQuery({query: '(max-width: 680px)'});

  useEffect(() => {
    if (currentNetwork){
      if(currentNetwork === 1){
          setTxLink("https://etherscan.io/")
      }
      else if(currentNetwork === 4){
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

  const [expandedKeys, setExpandedKeys] = useState([]);
  const onRow = ({ id }) =>
    expandedKeys.includes(id) && { className: 'expanded' };
  const onExpand = (expanded, record) => {
    const keys = expandedKeys;
    const moreKeys = expanded
      ? keys.concat(record.id)
      : keys.filter((k) => k !== record.id);

    setExpandedKeys(moreKeys);
  };

  return (
    <>
    {votes?
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={votes}
      pagination={pagination}
      onRow={onRow}
      onExpand={onExpand}
      expandRowByClick={true}
      expandIconColumnIndex={3}
      expandedRowRender={(record, index) => {
            return <div className="pastdispute_box" key={index}>
              <div><p>Value submitted by <a href={txLink+"address/"+record.miner} target="_blank" rel="noopener noreferrer">{truncateAddr(record.miner)}</a></p></div>
              <div><p>Total votes: {record.votes? record.votes.length: "0"}</p></div>
              <div className={record.result? "green bold":"bold"}><p>{record.result? <CheckOutlined />:<CloseOutlined />} Dispute {record.result? "Passed":"Rejected"}</p></div>
              <VotesPerDisputeTable voteFeed={voteFeed.votes} record={record} valueIndex={index} />

              </div>
          }}
    />
    : null }
    </>
  );
};

export default VotingTable;
