import React, { useContext } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';

import DisputeForm from 'components/disputes/DisputeForm';
import VoteForm from 'components/votes/VoteForm';
import Loader from 'components/shared/Loader';
import { getMinerValueStatus, getMatchingDispute } from 'utils/helpers';
import { OpenDisputesContext } from 'contexts/Store';

const WarningSpan = styled.span`
  color: #faad14;
`;

const MinerValues = ({ miningEvent, valueIndex, closeMinerValuesModal }) => {
  const [openDisputes] = useContext(OpenDisputesContext);

  const checkWarning = (text, record) => {
    const status = getMinerValueStatus(record, openDisputes, miningEvent);
    if (status === 'Mined') {
      return <span>{text || status}</span>;
    } else {
      return <WarningSpan>{text || status}</WarningSpan>;
    }
  };

  const getValue = (text, record, index) => {
    return record.values[valueIndex];
  };

  const columns = [
    {
      title: 'Value',
      render: getValue,
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
          const value = getValue(record, event, index);
          return (
            <DisputeForm
              value={value}
              miningEvent={miningEvent}
              minerIndex={index}
              closeMinerValuesModal={closeMinerValuesModal}
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
        <Loader />
      )}
    </>
  );
};

export default MinerValues;
