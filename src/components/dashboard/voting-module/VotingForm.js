import React, { useState, useContext, useEffect } from 'react';
import { fromWei } from 'utils/helpers';
import { Button, Modal } from 'antd';
import { UserContext } from 'contexts/User';
import { CONTRACT_UPGRADE } from 'utils/helpers';
import Submitter from 'components/shared/Submitter';

const VotingForm = ({ dispute }) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentTx1, setCurrentTx1] = useState();
  const [currentTx2, setCurrentTx2] = useState();
  const [userBalance, setUserBalance] = useState(0);
  const [hasVoted, setHasVoted] = useState();
  const [cantVote, setCantVote] = useState();
  const [error, setError] = useState();
  const [currentUser,] = useContext(UserContext);

  const voteOpenedAt = dispute.relatedMiningEventData[5]

  useEffect(() => {
    if (currentUser) {
      currentUser.contracts.didVote(dispute.disputeId, currentUser.address)
        .then(res => setHasVoted(res));
      currentUser.contracts.balanceOfAt(currentUser.address, voteOpenedAt).then(result => {
        setUserBalance(+result)
      })

    }
  }, [currentUser, processing]);


  const handleSubmit = async (supportsVote, setCurrentTx) => {
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
    }
    setProcessing(false);
  };

  const support = () => {
    handleSubmit(true, setCurrentTx1)
  }

  const challenge = () => {
    handleSubmit(false, setCurrentTx2)
  }

  const handleCancel = () => {
    setCurrentTx1()
    setCurrentTx2()
    setError()
    setProcessing(false)
    setVisible(false)
  };

  const renderTitle = () => {
    if (error) {
      return 'Transaction Error';
    } else if (processing) {
      return 'Sending Vote';
    } else if (currentTx1 || currentTx2) {
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
          {!cantVote ? (
            <>
              <h6>Your Voting Power</h6>
              <p className="BalanceStatus">
                {fromWei(userBalance)} TRB balance at block {voteOpenedAt}.
                      </p>
            </>
          ) : null
          }

          <Submitter
            error={error}
            cantSubmit={cantVote}
            processing={processing}
            currentTx={currentTx1}
            handleSubmit={support}
            buttonText="Support"
          />

          <Submitter
            error={error}
            cantSubmit={cantVote}
            processing={processing}
            currentTx={currentTx2}
            handleSubmit={challenge}
            buttonText="Challenge"
          />
        </>
      </Modal>
    </>
  );
};

export default VotingForm;
