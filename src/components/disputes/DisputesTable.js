import React, { useContext } from 'react';
import { Table } from 'antd';
import VoteForm from 'components/votes/VoteForm';
import { ContractContext } from 'contexts/Store';

const DisputesTable = ({ disputes, pagination }) => {
  console.log('disputes', disputes);
  const [contract] = useContext(ContractContext);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Symbol',
      dataIndex: 'requestSymbol',
      key: 'requestSymbol',
    },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    {
      title: 'Result (TRB)',
      dataIndex: 'tally',
      key: 'tally',
      render: (text) => {
        if (text) {
          return contract ? parseInt(+contract.service.fromWei(text)) : '';
        } else {
          return 'Pending';
        }
      },
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      render: (record) => {
        // const openDispute = record.id === '28';
        const openDispute = record.inVoteWindow;
        return <>{openDispute ? <VoteForm dispute={record} /> : null}</>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={'id'}
      dataSource={disputes}
      pagination={pagination}
    />
  );
};

export default DisputesTable;
