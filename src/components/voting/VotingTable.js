import React from 'react';
import { Table } from 'antd';
import VotingForm from 'components/voting/VotingForm';

const VotingTable = ({ votes, pagination }) => {
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Symbol', dataIndex: 'requestSymbol', key: 'requestSymbol' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Miner', dataIndex: 'miner', key: 'miner' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      render: (record) => {
        return <>{record.inVoteWindow ? <VotingForm dispute={record} /> : null}</>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={votes}
      pagination={pagination}
    />
  );
};

export default VotingTable;
