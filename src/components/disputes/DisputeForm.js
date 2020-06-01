import React, { useState, useContext } from 'react';
import { Modal, Button } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

import { ContractContext, CurrentUserContext } from 'contexts/Store';
import EtherscanLink from 'components/shared/EtherscanlLnk';

const DisputeForm = ({ value, miningEvent, minerIndex }) => {
  console.log('disputeForm', value, miningEvent, minerIndex);
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [currentTx, setCurrentTx] = useState();
  const [contract] = useContext(ContractContext);
  const [currentUser] = useContext(CurrentUserContext);

  const getTx = (tx) => {
    setCurrentTx(tx);
  };

  const handleSubmit = async () => {
    setProcessing(true);

    try {
      await contract.service.beginDispute(
        currentUser.username,
        miningEvent.requestId,
        miningEvent.time,
        minerIndex,
        getTx,
      );
    } catch (e) {
      console.error(`Error submitting dispute: ${e.toString()}`);
    } finally {
      setProcessing(false);
      setProcessed(true);
    }
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

            <p className="BalanceStatus">
              {canDispute ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              {contract.service.fromWei(contract.disputeFee)} TRB
            </p>

            {!currentUser ? (
              <>
                <p className="ErrorMsg">
                  You need to sign in with MetaMask to submit a dispute
                </p>
              </>
            ) : (
              <>
                {!canDispute && (
                  <p className="ErrorMsg">You need TRB to submit a dispute</p>
                )}
              </>
            )}

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
            <EtherscanLink txHash={currentTx} />
          </>
        ) : null}

        {processed ? (
          <>
            <CheckCircleOutlined />
            <EtherscanLink txHash={currentTx} />
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default DisputeForm;
