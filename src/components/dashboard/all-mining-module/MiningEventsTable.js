import React, { useState, useContext } from 'react';
import { Table } from 'antd';
// import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
// import MiningEvents from './MiningEvents';
import PrevMiningEvents from './PrevMiningEvents';

// import CurrentMiningEvents from './CurrentMiningEvents';

const MiningEventsTable = ({ events, pagination, current }) => {
  const columns = [
    {
      title: 'date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '24%',
      render: (text) => {
        const humandate = new Date(text * 1000).toLocaleString();
        if (current) {
          return <p>...</p>;
        } else {
          return <p>{humandate}</p>;
        }
      },
    },
    {
      title: 'previously mined',
      width: '68%',
      render: (text) => {
        let symbols;
        if (current) {
          symbols = text.minerValues[0].requestSymbols.join(', ');
        } else {
          symbols = text.requestSymbols.join(', ');
        }
        return <p className="bold Symbols">{symbols}</p>;
      },
    },
  ];

  if (current) {
    columns.splice(3, 1);
  }

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
      rowKey={current ? '0' : 'id'}
      dataSource={events}
      onRow={onRow}
      onExpand={onExpand}
      expandedRowRender={(record, index) => {
          return <PrevMiningEvents miningEvent={record} valueIndex={index} />;
      }}
      expandIconColumnIndex={6}
      expandRowByClick={true}
      pagination={pagination}
    />
  );
};

export default MiningEventsTable;
