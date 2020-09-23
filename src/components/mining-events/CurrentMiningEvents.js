import React from 'react';
import { Table } from 'antd';

import Loader from 'components/shared/Loader';
import DisputeModal from 'components/disputes/DisputeModal';

const CurrentMiningEvents = ({ miningEvent, valueIndex, current }) => {
  const eventData = miningEvent.minerValues[0];
  const tableValues = eventData.requestIds.map((requestId, i) => {
    return {
      requestId,
      requestSymbol: eventData.requestSymbols[i],
      minerValues: miningEvent.minerValues,
      value: 'Pending',
    };
  });

  const columns = [
    { title: 'ID', dataIndex: 'requestId', key: 'requestId', width: 100 },
    {
      title: 'Symbol',
      dataIndex: 'requestSymbol',
      key: 'requestSymbol',
      width: 300,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 300,
    },
    {
      render: (record, event, index) => {
        return (
          <DisputeModal
            miningEvent={record}
            valueIndex={index}
            current={true}
          />
        );
      },
    },
  ];

  return (
    <>
      {tableValues.length ? (
        <Table
          columns={columns}
          rowKey={'requestId'}
          dataSource={tableValues}
          pagination={false}
        />
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CurrentMiningEvents;
