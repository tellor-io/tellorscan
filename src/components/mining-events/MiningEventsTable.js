import React, { useState } from 'react';
import { Table } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import MinerValues from './MinerValues';

const MiningEventsTable = ({ events, pagination, current }) => {
  const columns = [
    { title: 'ID', dataIndex: 'requestId', key: 'requestId' },
    {
      title: 'Symbol',
      dataIndex: 'requestSymbol',
      key: 'requestSymbol',
    },
    { title: 'Value', dataIndex: 'minedValue', key: 'minedValue' },
    { title: 'Tip (TRB)', dataIndex: 'totalTips', key: 'totalTips' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (current) {
          return <p>{text} loading</p>;
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
