import React, { useState } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';

import GraphFetch from 'components/shared/GraphFetch';
import { GET_OPEN_DISPUTES } from 'utils/queries';

import DisputeForm from 'components/disputes/DisputeForm';
import VotingForm from 'components/voting/VotingForm';
import Loader from 'components/shared/Loader';
import { getMinedValueStatus, getMatchingDispute, VOTING_OPEN, MINED } from 'utils/helpers';

const WarningSpan = styled.span`
  color: #faad14;
`;

const MinerValues = ({ miningEvent, valueIndex, closeMinerValuesModal }) => {
  const [openDisputes, setOpenDisputes] = useState();

  GraphFetch({ query: GET_OPEN_DISPUTES, setRecords: setOpenDisputes, suppressLoading: true })

  const checkWarning = (text, record) => {
    let status = MINED
    if (openDisputes) {
      status = getMinedValueStatus(record, openDisputes, miningEvent);
    }
    if (status === MINED) {
      return <span>not disputed</span>;
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
      title: 'Miner',
      dataIndex: 'miner',
      key: 'miner',
    },
    {
      render: (record, event, index) => {
        if (
          openDisputes &&
          getMinedValueStatus(record, openDisputes, miningEvent) ===
          VOTING_OPEN
        ) {
          return (
            <VotingForm dispute={getMatchingDispute(openDisputes, miningEvent)} />
          );
        } else if (miningEvent.inDisputeWindow) {
          const value = getValue(record, event, index);
          return (
            <DisputeForm
              value={value}
              minerAddr={record.miner}
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
