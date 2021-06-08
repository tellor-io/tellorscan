import React from 'react';
import { Table } from 'antd';

import Loader from 'components/shared/Loader';
import { getGranPrice } from 'utils/helpers';
import MinerValuesModal from 'components/mining-events/MinerValuesModal';


const MiningEvents = ({ miningEvent, valueIndex, current }) => {

  const tableValues = miningEvent.requestIds.map((requestId, i) => {
    return {
      requestId,
      requestSymbol: miningEvent.requestSymbols[i],
      minedValue: miningEvent.minedValues[i],
      granPrice: getGranPrice(miningEvent.minedValues[i], requestId),
      totalTips: miningEvent.totalTips,
      status: miningEvent.status,
      timestamp: miningEvent.timestamp,
      minerValues: miningEvent.minerValues,
      inDisputeWindow: miningEvent.inDisputeWindow,
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
      dataIndex: 'minedValue',
      key: 'minedValue',
      width: current ? 300 : 200,
    },
    { title: 'Price', dataIndex: 'granPrice', key: 'granPrice', width: 200 },
    // {
    //   title: 'Tip (TRB)',
    //   dataIndex: 'totalTips',
    //   key: 'totalTips',
    //   width: current ? 200 : 100,
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (current) {
          return (
            <span className="fader">{text}</span>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      render: (record, event, index) => {
        return <MinerValuesModal miningEvent={record} valueIndex={index} />;
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

export default MiningEvents;