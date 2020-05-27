import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const VoteButton = ({ value }) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleSubmit = async () => {
    setProcessing(true);
    setTimeout(() => {
      // setVisible(false);
      setProcessing(false);
      setProcessed(true);
    }, 3000);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const renderTitle = () => {
    if (processing) {
      return 'Sending Vote';
    } else if (processed) {
      return 'Sent Vote';
    } else {
      return 'Vote';
    }
  };

  return (
    <>
      <Button type="default" onClick={() => setVisible(true)}>
        Vote
      </Button>
      <Modal
        visible={visible}
        title={renderTitle()}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={null}
      >
        {!processing && !processed ? (
          <>
            <p>Stake some TRB to dispute a value</p>
            <h6>Symbol</h6>
            <p>temp</p>
            <h6>Value</h6>
            <p>{value.value}</p>
            <h6>Your Voting Power</h6>
            <p>temp</p>
            <Button
              key="support"
              type="primary"
              size="large"
              // loading={loading}
              onClick={handleSubmit}
            >
              Support
            </Button>
            ,
            <Button
              key="challenge"
              type="danger"
              size="large"
              // loading={loading}
              onClick={handleSubmit}
            >
              Challenge
            </Button>
          </>
        ) : null}

        {processing ? (
          <>
            <LoadingOutlined />
            <p>View on Etherscan</p>
          </>
        ) : null}

        {processed ? (
          <>
            <CheckCircleOutlined />
            <p>View on Etherscan</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default VoteButton;
