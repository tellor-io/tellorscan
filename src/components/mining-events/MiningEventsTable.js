import React from 'react';
import { Table } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import MinerValues from './MinerValues';

const columns = [
  { title: 'ID', dataIndex: 'requestId', key: 'requestId' },
  {
    title: 'Symbol',
    dataIndex: 'requestSymbol',
    key: 'requestSymbol',
  },
  { title: 'Value', dataIndex: 'minedValue', key: 'minedValue' },
  { title: 'Tip (TRB)', dataIndex: 'totalTips', key: 'totalTips' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const MiningEventsTable = ({ events, pagination }) => {
  return (
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={events}
      expandedRowRender={(record) => (
        <MinerValues values={record.minerValues} />
      )}
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
