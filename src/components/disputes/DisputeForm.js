import React, { useState, useContext } from 'react';
import { Modal, Button } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ContractContext, CurrentUserContext } from 'contexts/Store';

const DisputeForm = ({ value, miningEvent }) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [contract] = useContext(ContractContext);
  const [currentUser] = useContext(CurrentUserContext);

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

  const renderTitle = () => {
    if (processing) {
      return 'Sending Dispute';
    } else if (processed) {
      return 'Sent Dispute';
    } else {
      return 'Dispute';
    }
  };

  //todo: check if already disputed
  const canDispute = currentUser && +currentUser.balance > contract.disputeFee;
  // const canDispute = true;

  return (
    <>
      <Button type="default" onClick={() => setVisible(true)}>
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
            <h6>Symbol</h6>
            <p>{miningEvent.requestSymbol}</p>

            <h6>Value</h6>
            <p>{value.value}</p>

            <h6>Stake required to Dispute this value *</h6>

            <p>
              {canDispute ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              {contract.service.fromWei(contract.disputeFee)} TRB
            </p>

            {!canDispute && <p>You need TRB to submit a dispute</p>}

            <Button
              key="submit"
              type="primary"
              size="large"
              onClick={handleSubmit}
              disabled={!canDispute}
            >
              Submit Dispute
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

export default DisputeForm;
