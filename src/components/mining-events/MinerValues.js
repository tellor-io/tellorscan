import React from 'react';
import { Table } from 'antd';
import styled from 'styled-components';

import DisputeForm from 'components/disputes/DisputeForm';
import VoteForm from 'components/votes/VoteForm';

const WarningP = styled.div`
  color: #faad14;
`;

const MinerValues = ({ miningEvent }) => {
  const checkWarning = (text, record) => {
    if (record.status === 'Mined') {
      return <p>{text}</p>;
    } else {
      return <WarningP>{text}</WarningP>;
    }
  };
  const columns = [
    { title: 'Miner', dataIndex: 'miner', key: 'miner' },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: checkWarning,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: checkWarning,
    },
    {
      render: (record) => {
        if (record.status === 'Open Dispute') {
          return <VoteForm dispute={record} />;
        } else if (miningEvent.inDisputeWindow) {
          return <DisputeForm value={record} miningEvent={miningEvent} />;
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
