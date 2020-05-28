import React from 'react';
import { Table } from 'antd';
import styled from 'styled-components';

import DisputeForm from 'components/disputes/DisputeForm';
import VoteForm from 'components/votes/VoteForm';

const WarningP = styled.div`
  color: #faad14;
`;

const MinerValues = ({ miningEvent }) => {
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
          return <DisputeForm value={record} miningEvent={miningEvent} />;
        } else {
          return <VoteForm value={record} />;
        }
      },
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={miningEvent.minerValues}
      pagination={false}
    />
  );
};

export default MinerValues;
