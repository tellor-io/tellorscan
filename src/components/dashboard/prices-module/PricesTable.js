import React, { useState, useContext } from 'react';
import { Table, Button, Input, Modal } from 'antd';
import { UserContext } from 'contexts/User';
import Submitter from 'components/shared/Submitter';

const PricesTable = ({ data }) => {

  const [currentUser,] = useContext(UserContext);

  const [error, setError] = useState();
  const [processing, setProcessing] = useState();
  const [currentTx, setCurrentTx] = useState();

  const [modal, setModal] = useState({ visible: false });
  const [tip, setTip] = useState("0");


  const handleCancel = () => {
    setModal({ visible: false })
    setCurrentTx()
    setError()
    setProcessing(false)
  };

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      setError()
      if (!isTipValid(tip)) {
        setError("invalid tip amount")
      } else {
        await currentUser.contracts.addTip(
          {
            from: currentUser.address,
            id: modal.id,
            amount: tipToWei(tip),
            setTx: setCurrentTx
          })
      }
    } catch (e) {
      console.error(`Error adding tip: ${e.toString()}`);
      setError(e);
    }
    setProcessing(false);
  };

  const isTipValid = (val) => {
    const numericTip = parseFloat(val.replaceAll(',', '.'));
    return !isNaN(numericTip) && numericTip > 0;
  }

  const tipToWei = (val) => {
    return currentUser.web3.utils.toWei(val.replaceAll(',', '.'), 'ether');
  }

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
    {
      title: 'Current Tip', dataIndex: 'tip', key: 'tip',
      render: (value) => {
        return (
          value / 1E18
        );
      },
    },
    {
      title: '',
      render: (text, row) => {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => setModal({ visible: true, id: row.id })}
          >
            + Add Tip
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        rowKey={'id'}
        dataSource={data}
        pagination={false}
      />
      <Modal
        title="Add Tip"
        visible={modal.visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Input
          placeholder="Amount of TRB "
          disabled={!currentUser}
          onChange={(e) => setTip(e.target.value)}
        />
        <Submitter
          error={error}
          processing={processing}
          currentTx={currentTx}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          buttonText="Tip"
        />
      </Modal>
    </>
  );
};

export default PricesTable;
