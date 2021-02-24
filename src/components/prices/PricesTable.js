import React from 'react';
import { Table } from 'antd';

const PricesTable = ({ data }) => {
  const columns = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    {
      title: 'Time', dataIndex: 'timestamp', key: 'timestamp',
      render: (value) => {
        let newDate = new Date(+value * 1000);
        return (
          newDate.toUTCString()
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={data}
      pagination={false}
    />
  );
};

export default PricesTable;
