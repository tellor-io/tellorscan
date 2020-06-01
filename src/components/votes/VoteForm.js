import React, { useState, useContext, useEffect } from 'react';
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
  const [hasVoted, setHasVoted] = useState();
  const [error, setError] = useState();
  const [contract] = useContext(ContractContext);
  const [currentUser] = useContext(CurrentUserContext);

  useEffect(() => {
    const getHasVoted = async () => {
      const res = await contract.service.didVote(
        dispute.disputeId,
        currentUser.username,
      );

      setHasVoted(res);
    };

    if (currentUser) {
      getHasVoted();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const getTx = (tx) => {
    setCurrentTx(tx);
  };

  const getError = (err) => {
    setError(err);
  };

  const handleSubmit = async (supportsDispute) => {
    setProcessing(true);

    try {
      await contract.service.vote(
        currentUser.username,
        dispute.disputeId,
        supportsDispute,
        getTx,
        getError,
      );
    } catch (e) {
      console.error(`Error submitting vote: ${e.toString()}`);
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
      return 'Sending Vote';
    } else if (processed) {
      return 'Sent Vote';
    } else {
      return 'Vote';
    }
  };

  const canVote = currentUser && +currentUser.balance > 0 && !hasVoted;
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
        {error && <p className="ErrorMsg">Error Submitting Transaction</p>}

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

                {!canVote && !hasVoted ? (
                  <p className="ErrorMsg">You need TRB to vote</p>
                ) : null}
                {!canVote && hasVoted ? (
                  <p className="ErrorMsg">You already voted on this dispute</p>
                ) : null}
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

        {processing && !error ? (
          <>
            <LoadingOutlined />
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

export default VoteForm;
