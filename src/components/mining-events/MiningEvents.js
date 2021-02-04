import React, { useContext } from 'react';
import { Table } from 'antd';
import Lottie from 'react-lottie';

import Loader from 'components/shared/Loader';
import { ModeContext } from 'contexts/Store';
import { getMedianValue, getGranPrice } from 'utils/helpers';
import DisputeModal from 'components/disputes/DisputeModal';

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

  const tableValues = miningEvent.requestIds.map((requestId, i) => {
    const medianValue = getMedianValue(miningEvent.minerValues, i);
    return {
      requestId,
      requestSymbol: miningEvent.requestSymbols[i],
      minedValue: medianValue,
      granPrice: getGranPrice(medianValue, requestId),
      totalTips: miningEvent.totalTips,
      status: miningEvent.status,
      minerValues: miningEvent.minerValues,
      inDisputeWindow: miningEvent.inDisputeWindow,
      time: miningEvent.time,
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
        return <DisputeModal miningEvent={record} valueIndex={index} />;
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
