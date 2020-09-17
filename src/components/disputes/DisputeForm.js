import React, { useState, useContext } from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { ContractContext, CurrentUserContext } from 'contexts/Store';
import Loader from '../shared/Loader';
import EtherscanLink from 'components/shared/EtherscanlLnk';

const DisputeForm = ({
  value,
  miningEvent,
  closeMinerValuesModal,
  minerIndex,
}) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [currentTx, setCurrentTx] = useState();
  const [error, setError] = useState();
  const [contract] = useContext(ContractContext);
  const [currentUser] = useContext(CurrentUserContext);

  const getTx = (tx) => {
    setCurrentTx(tx);
  };

  const getError = (err) => {
    setError(err);
  };

  const handleSubmit = async () => {
    setProcessing(true);

    try {
      await contract.service.beginDispute(
        currentUser.username,
        miningEvent.requestId,
        miningEvent.time,
        minerIndex,
        // value.miner,
        getTx,
        getError,
      );
    } catch (e) {
      console.error(`Error submitting dispute: ${e.toString()}`);
      setError(e);
    } finally {
      setProcessing(false);
      setProcessed(true);
    }
  };

  const handleCancel = () => {
    setProcessed(false);
    setProcessing(false);
    setError();
    setCurrentTx();
    setVisible(false);
  };

  const renderTitle = () => {
    if (error) {
      return 'Transaction Error';
    } else if (processing) {
      return 'Sending Dispute';
    } else if (processed) {
      return 'Sent Dispute';
    } else {
      return 'Dispute';
    }
  };

  const handleOpen = () => {
    closeMinerValuesModal();
    setVisible(true);
  };

  const canDispute = currentUser && +currentUser.balance > contract.disputeFee;
  // const canDispute = true;

  return (
    <>
      <Button type="default" onClick={handleOpen}>
        Dispute
      </Button>
      <Modal
        visible={visible}
        title={renderTitle()}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={null}
      >
        {error && <p className="ErrorMsg">Error Submitting Transaction</p>}

        {!processing && !processed ? (
          <>
            <p>Stake some TRB to dispute a value</p>
            <h6>Symbol</h6>
            <p>{miningEvent.requestSymbol}</p>

            <h6>Value</h6>
            <p>{value}</p>

            <h6>Stake required to Dispute this value *</h6>

            <p className="BalanceStatus">
              {canDispute ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined style={{ color: '#dd5858' }} />
              )}
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

        {processing && !error ? (
          <>
            <Loader />
            {currentTx && <EtherscanLink txHash={currentTx} />}
          </>
        ) : null}

        {processed && !error ? (
          <>
            <CheckCircleOutlined />
            {currentTx && <EtherscanLink txHash={currentTx} />}
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default DisputeForm;
