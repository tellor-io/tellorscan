import React, { useState, useContext, useEffect } from 'react';
import Loader from 'components/shared/Loader';
import { fromWei } from 'utils/helpers';
import { Button, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { UserContext } from 'contexts/User';
import EtherscanLink from 'components/shared/EtherscanlLnk';
import { CONTRACT_UPGRADE } from 'utils/helpers';

const VotingForm = ({ dispute }) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [currentTx, setCurrentTx] = useState();
  const [userBalance, setUserBalance] = useState(0);
  const [hasVoted, setHasVoted] = useState();
  const [cantVote, setCantVote] = useState();
  const [error, setError] = useState();
  const [currentUser,] = useContext(UserContext);

  const voteOpenedAt = dispute.relatedMiningEventData[5]

  useEffect(() => {
    if (currentUser) {
      currentUser.contracts.didVote(dispute.disputeId, currentUser.address,)
        .then(res => setHasVoted(res));
      currentUser.contracts.balanceOfAt(currentUser.address, voteOpenedAt).then(result => {
        setUserBalance(+result)
      })

    }
  }, [currentUser]);



  const handleSubmit = async (supportsVote) => {
    setProcessing(true);
    try {
      await currentUser.contracts.vote(
        currentUser.address,
        dispute.disputeId,
        supportsVote,
        setCurrentTx,
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

  useEffect(() => {
    if (currentUser && dispute && (currentUser.address.toLowerCase() == dispute.miner.toLowerCase())) {
      setCantVote("can't vote for own eth address")
      return
    }
    if (userBalance == 0) {
      setCantVote("can't vote with zero balance")
      return
    } else {
      setCantVote()
    }
    if (hasVoted) {
      setCantVote("already voted")
      return
    }

  }, [currentUser, dispute, userBalance, hasVoted])

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
            <h6>Vote open at block: {voteOpenedAt}</h6>
            {dispute.requestSymbol == CONTRACT_UPGRADE ? (<h3>Vote for:{dispute.requestSymbol}</h3>) : (
              <>
                <h6>Symbol</h6>
                <p>{dispute.requestSymbol}</p>
                <h6>Value</h6>
                <p>{dispute.value}</p>
              </>
            )}
            {currentUser ? (
              <>
                {cantVote ? (
                  <h4 className="ErrorMsg">{cantVote}</h4>
                ) : (
                  <>
                    <h6>Your Voting Power</h6>
                    <p className="BalanceStatus">
                      {fromWei(userBalance)} TRB balance at block {voteOpenedAt}.
                      </p>
                  </>
                )}
              </>
            ) : (
              <h4 className="ErrorMsg">
                You need to sign in with MetaMask to vote
              </h4>
            )}
            <Button
              key="support"
              type="primary"
              size="large"
              onClick={() => handleSubmit(true)}
              disabled={cantVote}
              style={{ marginRight: '15px' }}
            >
              Support
            </Button>
            <Button
              key="challenge"
              type="danger"
              size="large"
              onClick={() => handleSubmit(false)}
              disabled={cantVote}
            >
              Challenge
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

export default VotingForm;
