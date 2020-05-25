import React from 'react';
import { Table } from 'antd';
import DisputeButton from 'components/disputes/DisputeButton';

const columns = [
  { title: 'Miner', dataIndex: 'miner', key: 'miner' },
  { title: 'Value', dataIndex: 'value', key: 'value' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    render: (record) => <DisputeButton value={record} />,
  },
];

const MinerValues = ({ values }) => {
  console.log('values', values);
  return (
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={values}
      pagination={false}
    />
  );
};

export default MinerValues;
