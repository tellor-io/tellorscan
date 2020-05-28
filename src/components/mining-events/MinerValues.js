import React from 'react';
import { Table } from 'antd';
import styled from 'styled-components';

import DisputeForm from 'components/disputes/DisputeForm';
import VoteForm from 'components/votes/VoteForm';

const WarningP = styled.div`
  color: #faad14;
`;

const columns = [
  { title: 'Miner', dataIndex: 'miner', key: 'miner' },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    render: (text, record) => {
      if (record.status === 'Mined') {
        return <p>{text}</p>;
      } else {
        return <WarningP>{text}</WarningP>;
      }
    },
  },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    render: (record) => {
      if (record.status === 'Mined') {
        return <DisputeForm value={record} />;
      } else {
        return <VoteForm value={record} />;
      }
    },
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
