import React, { useContext } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';

import DisputeForm from 'components/disputes/DisputeForm';
import VoteForm from 'components/votes/VoteForm';
import { getMinerValueStatus, getMatchingDispute } from 'utils/helpers';
import { OpenDisputesContext } from 'contexts/Store';

const WarningP = styled.div`
  color: #faad14;
`;

const MinerValues = ({ miningEvent }) => {
  const [openDisputes] = useContext(OpenDisputesContext);

  const checkWarning = (text, record) => {
    const status = getMinerValueStatus(record, openDisputes, miningEvent);
    if (status === 'Mined') {
      return <p>{text || status}</p>;
    } else {
      return <WarningP>{text || status}</WarningP>;
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
      render: (record, event, index) => {
        if (
          getMinerValueStatus(record, openDisputes, miningEvent) ===
          'Open Dispute'
        ) {
          return (
            <VoteForm dispute={getMatchingDispute(openDisputes, miningEvent)} />
          );
        } else if (miningEvent.inDisputeWindow) {
          return (
            <DisputeForm
              value={record}
              miningEvent={miningEvent}
              minerIndex={index}
            />
          );
        }
      },
    },
  ];

  return (
    <>
      {miningEvent.minerValues.length ? (
        <Table
          columns={columns}
          rowKey={'id'}
          dataSource={miningEvent.minerValues}
          pagination={false}
        />
      ) : (
        <p>No Pending Miner Values</p>
      )}
    </>
  );
};

export default MinerValues;
