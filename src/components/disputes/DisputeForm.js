import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { chains } from 'utils/chains';
import { fromWei } from 'utils/helpers';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';


import { UserContext } from 'contexts/User';
import { NetworkContext } from 'contexts/Network';

import Loader from '../shared/Loader';
import EtherscanLink from 'components/shared/EtherscanlLnk';



const DisputeForm = ({
  value,
  miningEvent,
  closeMinerValuesModal,
  minerAddr,
  minerIndex,
}) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [currentTx, setCurrentTx] = useState();
  const [error, setError] = useState();
  const [disputeFee, setDisputeFee] = useState();
  const [userBalance, setUserBalance] = useState(0);
  const [canDispute, setCanDispute] = useState(false);

  const [currentNetwork] = useContext(NetworkContext);
  const [currentUser,] = useContext(UserContext);

  const handleSubmit = async () => {
    setProcessing(true);

    try {
      await currentUser.contracts.beginDispute(
        currentUser.address,
        miningEvent.requestId,
        miningEvent.time,
        minerIndex,
        setCurrentTx,
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

  useEffect(() => {
    fetch(chains[currentNetwork].apiURL + "/getDisputeFee")
      .then(response => response.json())
      .then(data =>
        setDisputeFee(fromWei(data.disputeFee))
      );
  }, [])

  useEffect(() => {
    if (currentUser && disputeFee) {
      currentUser.contracts.balanceOf(currentUser.address).then(result => {
        let balance = fromWei(result)
        setUserBalance(balance)
        setCanDispute(balance > disputeFee)
      })
    }
  }, [currentUser, disputeFee]);


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
        width="60em"
      >
        {error && <p className="ErrorMsg">Error Submitting Transaction</p>}

        {!processing && !processed ? (
          <>
            {!miningEvent.requestSymbol ? null : ( // This is a vote so no need to display dispute fields.
              <>
                <h6>Miner Address</h6>
                <p>{minerAddr}</p>
                <h6>Miner Index</h6>
                <p>{minerIndex}</p>
                <h6>Symbol</h6>
                <p>{miningEvent.requestSymbol}</p>
                <h6>Value</h6>
                <p>{value}</p>
                <h6>TRB Stake dispute fee</h6>
                <p>{disputeFee}</p>
                <h6>Your balance</h6>
                <p>{userBalance}</p>
              </>
            )}

            {!currentUser ? (
              <>
                <h4 className="ErrorMsg">
                  You need to sign in with MetaMask to submit a dispute.
                </h4>
              </>
            ) : (
              <>
                {canDispute ? null : (
                  <p className="ErrorMsg">Not enough TRB to submit a dispute</p>
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
