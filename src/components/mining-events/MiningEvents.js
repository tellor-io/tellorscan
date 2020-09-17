import React, { useContext } from 'react';
import { Table, Button } from 'antd';
import styled from 'styled-components';
import Lottie from 'react-lottie';

import Loader from 'components/shared/Loader';
import { ModeContext } from 'contexts/Store';

const WarningP = styled.div`
  color: #faad14;
`;

const MiningEvents = ({ miningEvent, valueIndex, current }) => {
  const [mode] = useContext(ModeContext);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: mode,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  console.log('valueIndex', valueIndex);
  console.log('miningEvent in subtable', miningEvent);
  const tableValues = miningEvent.requestIds.map((requestId, i) => {
    return {
      requestId,
      requestSymbol: miningEvent.requestSymbols[i],
      minedValue: miningEvent.minedValues[i],
      granPrice: miningEvent.granPrices[i],
      totalTips: miningEvent.totalTips,
      status: miningEvent.status,
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
    {
      title: 'Tip (TRB)',
      dataIndex: 'totalTips',
      key: 'totalTips',
      width: current ? 200 : 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (current) {
          return (
            <span className="LoaderSmall">
              {text} <Lottie options={defaultOptions} height={36} width={36} />
            </span>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      render: (record, event, index) => {
        return <Button>View Miner Values</Button>;
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
