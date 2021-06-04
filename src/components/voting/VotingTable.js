import React, { useState } from 'react';
import { Table } from 'antd';
import VotingForm from 'components/voting/VotingForm';
import { fromWei } from 'utils/helpers';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
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

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Symbol', dataIndex: 'requestSymbol', key: 'requestSymbol' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Miner', dataIndex: 'miner', key: 'miner' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Tally', dataIndex: 'tally', key: 'tally', render: ((tally) => fromWei(tally)) },
    {
      render: (record) => {
        return <>{record.inVoteWindow ? <VotingForm dispute={record} /> : null}</>;
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
    <Table
      columns={columns}
      rowKey={'id'}
      onRow={onRow}
      onExpand={onExpand}
      expandedRowRender={(record, index) => {
        return (
          <VotesPerDisputeTable voteFeed={voteFeed.votes} record={record} valueIndex={index} />
        );
      }
      }
      expandIconColumnIndex={0}
      expandIcon={({ expanded, onExpand, record }) =>
        expanded ? (
          <span>
            <MinusOutlined />
          </span>
        ) : (
          <span>
            <PlusOutlined />
          </span>
        )
      }
      expandRowByClick={true}
      dataSource={votes}
      pagination={pagination}
    />
  );
};

export default VotingTable;
