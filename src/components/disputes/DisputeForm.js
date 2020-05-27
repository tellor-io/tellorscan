import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const DisputeForm = ({ value }) => {
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
      return 'Sending Dispute';
    } else if (processed) {
      return 'Sent Dispute';
    } else {
      return 'Dispute';
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Dispute
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
            <p>Symbol</p>
            <p>temp</p>

            <p>Value</p>
            <p>{value.value}</p>

            <p>Stake required to Dispute this value *</p>
            <p>temp</p>

            <Button key="submit" type="primary" onClick={handleSubmit}>
              Submit Dispute
            </Button>
          </>
        ) : null}

        {processing ? (
          <>
            <p>loading</p>
            <p>View on Etherscan</p>
          </>
        ) : null}

        {processed ? (
          <>
            <p>big checkmark</p>
            <p>View on Etherscan</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default DisputeForm;
