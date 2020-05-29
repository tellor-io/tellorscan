import React, { useState, useContext } from 'react';
import { Button, Modal } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { CurrentUserContext } from 'contexts/Store';

const VoteForm = ({ dispute }) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  // const [contract] = useContext(ContractContext);
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
                  {currentUser.balance} TRB
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
              onClick={handleSubmit}
              disabled={!canVote}
            >
              Support
            </Button>
            <Button
              key="challenge"
              type="danger"
              size="large"
              onClick={handleSubmit}
              disabled={!canVote}
            >
              Challenge
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

export default VoteForm;
