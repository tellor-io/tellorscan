import React, { useState } from 'react';
import { Table } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import MinerValues from './MinerValues';
import Lottie from 'react-lottie';
import animationData from '../../assets/Tellor__Loader.json';

const MiningEventsTable = ({ events, pagination, current }) => {
  console.log('events', events);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const columns = [
    { title: 'ID', dataIndex: 'requestId', key: 'requestId', width: 100 },
    {
      title: 'Symbol',
      dataIndex: 'requestSymbol',
      key: 'requestSymbol',
      width: 300,
    },
    { title: 'Value', dataIndex: 'minedValue', key: 'minedValue', width: 300 },
    {
      title: 'Tip (TRB)',
      dataIndex: 'totalTips',
      key: 'totalTips',
      width: 200,
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
  ];

  const [expandedKeys, setExpandedKeys] = useState([]);
  const onRow = ({ id }) =>
    expandedKeys.includes(id) && { className: 'expanded' };
  const onExpand = (expanded, record) => {
    const keys = expandedKeys;
    const moreKeys = expanded
      ? keys.concat(record.id)
      : keys.filter((k) => k !== record.id);

    setExpandedKeys(moreKeys);
  };

  return (
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={events}
      onRow={onRow}
      onExpand={onExpand}
      expandedRowRender={(record) => <MinerValues miningEvent={record} />}
      expandIconColumnIndex={5}
      expandIcon={({ expanded, onExpand, record }) =>
        expanded ? (
          <span>
            <MinusOutlined />
          </span>
        ) : (
          <span>
            <PlusOutlined />
          </span>
        )
      }
      expandRowByClick={true}
      pagination={pagination}
    />
  );
};

export default MiningEventsTable;
