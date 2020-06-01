import React, { useState, useContext } from 'react';
import { Button, Modal } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { CurrentUserContext, ContractContext } from 'contexts/Store';
import EtherscanLink from 'components/shared/EtherscanlLnk';

const VoteForm = ({ dispute }) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [currentTx, setCurrentTx] = useState();
  const [contract] = useContext(ContractContext);
  const [currentUser] = useContext(CurrentUserContext);

  const getTx = (tx) => {
    console.log('calling getTx', tx);
    setCurrentTx(tx);
  };

  const handleSubmit = async (supportsDispute) => {
    setProcessing(true);

    console.log('dispute form', dispute);
    try {
      await contract.service.vote(
        currentUser.username,
        dispute.id,
        supportsDispute,
        getTx,
      );
    } catch (e) {
      console.error(`Error submitting vote: ${e.toString()}`);
    } finally {
      console.log('vote submitted');

      setProcessing(false);
      setProcessed(true);
    }
  };

  const handleCancel = () => {
    setVisible(false);
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

  const canVote = currentUser && +currentUser.balance > 0;
  // const canVote = true;

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
            <p>{dispute.requestSymbol}</p>
            <h6>Value</h6>
            <p>{dispute.value}</p>
            {currentUser ? (
              <>
                <h6>Your Voting Power</h6>
                <p className="BalanceStatus">
                  {canVote ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  {currentUser.balance &&
                    contract.service.fromWei(
                      currentUser.balance.toString(),
                    )}{' '}
                  TRB
                </p>

                {!canVote && <p className="ErrorMsg">You need TRB to vote</p>}
              </>
            ) : (
              <p className="ErrorMsg">
                You need to sign in with MetaMask to vote
              </p>
            )}
            <Button
              key="support"
              type="primary"
              size="large"
              onClick={() => handleSubmit(true)}
              disabled={!canVote}
            >
              Support
            </Button>
            <Button
              key="challenge"
              type="danger"
              size="large"
              onClick={() => handleSubmit(false)}
              disabled={!canVote}
            >
              Challenge
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

export default VoteForm;
