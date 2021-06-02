import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { chains } from 'utils/chains';
import { fromWei } from 'utils/helpers';
import Submitter from 'components/shared/Submitter';


import { UserContext } from 'contexts/User';
import { NetworkContext } from 'contexts/Network';



const DisputeForm = ({
  value,
  miningEvent,
  closeMinerValuesModal,
  minerAddr,
}) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentTx, setCurrentTx] = useState();
  const [error, setError] = useState();
  const [disputeFee, setDisputeFee] = useState();
  const [minerIndex, setMinerIndex] = useState();
  const [userBalance, setUserBalance] = useState(0);
  const [cantSubmit, setCantSubmit] = useState();

  const [currentNetwork] = useContext(NetworkContext);
  const [currentUser,] = useContext(UserContext);

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      await currentUser.contracts.beginDispute(
        currentUser.address,
        miningEvent.requestId,
        miningEvent.timestamp,
        minerIndex,
        setCurrentTx,
      );
    } catch (e) {
      console.error(`Error submitting dispute: ${e.toString()}`);
      setError(e);
    }
    setProcessing(false);
  };

  const handleCancel = () => {
    setProcessing(false);
    setError();
    setCurrentTx();
    setVisible(false);
  };

  const renderTitle = () => {
    if (error) {
      return 'Transaction Error';
    } else if (currentTx) {
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
    fetch(chains[currentNetwork].apiURL + "/getMiners/" + miningEvent.requestId + "/" + miningEvent.timestamp)
      .then(response => response.json())
      .then(data => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].toLowerCase() == minerAddr.toLowerCase()) {
            setMinerIndex(index)
            return
          }
        }
      });
  }, [])

  useEffect(() => {
    fetch(chains[currentNetwork].apiURL + "/getDisputeFee")
      .then(response => response.json())
      .then(data =>
        setDisputeFee(fromWei(data.disputeFee))
      );
  }, [])

  useEffect(() => {
    if (currentUser && disputeFee && minerIndex) {
      currentUser.contracts.balanceOf(currentUser.address).then(result => {
        let balance = fromWei(result)
        setUserBalance(balance)
        setCantSubmit(balance < disputeFee ? "Not enough balance" : null)
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
        <>
          {!miningEvent.requestSymbol ? null : ( // This is a vote so no need to display dispute fields.
            <>
              <h6>Miner Address</h6>
              <p>{minerAddr}</p>
              <h6>Miner Index</h6>
              <p>{minerIndex}</p>
              <h6>Symbol</h6>
              <p>{miningEvent.requestSymbol} - {miningEvent.requestId}</p>
              <h6>Timestamp</h6>
              <p>{miningEvent.timestamp}</p>
              <h6>Value</h6>
              <p>{value}</p>
              <h6>TRB Stake dispute fee</h6>
              <p>{disputeFee}</p>
              <h6>Your balance</h6>
              <p>{userBalance}</p>
            </>
          )}

        </>

        <Submitter
          error={error}
          cantSubmit={cantSubmit}
          processing={processing}
          currentTx={currentTx}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          buttonText="Dispute"
        />
      </Modal>
    </>
  );
};

export default DisputeForm;
