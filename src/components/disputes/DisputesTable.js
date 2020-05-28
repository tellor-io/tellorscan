import React from 'react';
import { Table } from 'antd';
import VoteForm from 'components/votes/VoteForm';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  {
    title: 'Symbol',
    dataIndex: 'requestSymbol',
    key: 'requestSymbol',
  },
  { title: 'Value', dataIndex: 'value', key: 'value' },
  { title: 'Challenged (TRB)', dataIndex: 'challenged', key: 'challenged' },
  { title: 'Supported (TRB)', dataIndex: 'supported', key: 'supported' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    render: (record) => {
      return <>{record.id === '28' ? <VoteForm value={record} /> : null}</>;
    },
  },
];

const DisputesTable = ({ disputes, pagination }) => {
  return (
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={disputes}
      pagination={pagination}
    />
  );
};

export default DisputesTable;
