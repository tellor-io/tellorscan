import React, { useState, useEffect, useContext } from 'react';
import { getGranPrice, truncateAddr } from 'utils/helpers';
import { Collapse, Button } from 'antd';
import VotingTable from 'components/dashboard/voting-module/VotingTable';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { UserContext } from 'contexts/User';
import { List } from 'antd';

const { Panel } = Collapse;

const VoteItem = ({ data }) => {
  const humandate = new Date(data.timestamp * 1000).toLocaleString();
  const [processing, setProcessing] = useState(false);
  const [currentTx1, setCurrentTx1] = useState();
  const [currentTx2, setCurrentTx2] = useState();
  const [userBalance, setUserBalance] = useState(0);
  const [hasVoted, setHasVoted] = useState();
  const [cantVote, setCantVote] = useState();
  const [currentUser] = useContext(UserContext);

  const voteOpenedAt = data.relatedMiningEventData[5];

  useEffect(() => {
    if (currentUser) {
      currentUser.contracts
        .didVote(data.disputeId, currentUser.address)
        .then((res) => setHasVoted(res));
      currentUser.contracts
        .balanceOfAt(currentUser.address, voteOpenedAt)
        .then((result) => {
          setUserBalance(+result);
        });
    }
  }, [currentUser, processing]);

  useEffect(() => {
    if (
      currentUser &&
      data &&
      currentUser.address.toLowerCase() == data.miner.toLowerCase()
    ) {
      setCantVote("You can't vote for own ETH address.");
      return;
    }
    if (userBalance == 0) {
      setCantVote("You weren't holding TRB when this value was disputed.");
      return;
    } else {
      setCantVote();
    }
    if (hasVoted) {
      setCantVote('You have voted on this dispute.');
      return;
    }
  }, [currentUser, data, userBalance, hasVoted]);

  const handleSubmit = async (supportsVote, setCurrentTx) => {
    setProcessing(true);
    try {
      await currentUser.contracts.vote(
        currentUser.address,
        data.disputeId,
        supportsVote,
        setCurrentTx,
      );
    } catch (e) {
      console.error(`Error submitting vote: ${e.toString()}`);
      //   setError(e);
    }
    setProcessing(false);
  };

  return (
    <div className="VoteItem">
      <p>
        Dispute Id: <strong>{data.disputeId}</strong>
      </p>
      <p>Disputed value</p>
      <div className="dispvalue">
        <h3>
          <span className="val">
            {getGranPrice(data.value, data.requestId)}
          </span>{' '}
          {data.requestSymbol}
        </h3>
      </div>
      <div className="otherinfo">
        <div>
          <p>Disputed on</p>
          <h3>{humandate}</h3>
        </div>
        <div>
          <p>Votes</p>
          <h3>{data.votes ? data.votes.length : '0'}</h3>
        </div>
        <div>
          <p>Value submitted by</p>
          <h3>
            <a>{truncateAddr(data.miner)}</a>
          </h3>
        </div>
      </div>
      {currentUser ? (
        <>
          {cantVote ? (
            <div className="cantVote">
              <p>{cantVote}</p>
            </div>
          ) : (
            <>
              {processing ? (
                <div className="processingTX">
                  <p>Processing your tx...</p>
                </div>
              ) : (
                <div className="buttons">
                  <Button
                    className="challengebtn"
                    type="large"
                    onClick={() => handleSubmit(false, setCurrentTx2)}
                    disabled={cantVote}
                  >
                    <CloseOutlined />
                    challenge
                  </Button>
                  <Button
                    type="large"
                    onClick={() => handleSubmit(true, setCurrentTx1)}
                    disabled={cantVote}
                  >
                    <CheckOutlined />
                    support
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="notConn">
          <p>Please connect to vote on this dispute.</p>
        </div>
      )}
    </div>
  );
};

const VotingModule = ({ disputes, activeDisputesCount, disputesReady }) => {
  const [copy, setCopy] = useState(
    'There are currently no disputes to vote on.',
  );
  const [openPastDisputes, toggleOpenPastDisputes] = useState(false);
  const [activeDisputes, setActiveDisputes] = useState();
  const [pastDisputes, setPastDisputes] = useState();

  useEffect(() => {
    if (disputes) {
      const actived = [];
      const pastd = [];

      disputes.forEach((d, i) => {
        if (d.inVoteWindow) {
          actived.push(d);
        } else {
          pastd.push(d);
        }
      });
      setActiveDisputes(actived);
      setPastDisputes(pastd);
    }
  }, [disputes]);

  useEffect(() => {
    if (activeDisputesCount) {
      if (activeDisputesCount > 0) {
        if (activeDisputesCount > 1) {
          setCopy('There are ' + activeDisputesCount + ' active disputes.');
        } else {
          setCopy('There is 1 active dispute.');
        }
      }
    }
  }, [activeDisputesCount]);

  return (
    <>
      {disputesReady ? (
        <div className="VotingModule">
          <h2>{copy}</h2>
          {activeDisputes ? (
            <div className="items">
              {activeDisputes.length > 5 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={activeDisputes}
                  pagination={{ pageSize: 5, showSizeChanger: false }}
                  renderItem={(item) => <VoteItem data={item} />}
                />
              ) : (
                <>
                  {activeDisputes.map((d, i) => {
                    return <VoteItem key={i} data={d} />;
                  })}
                </>
              )}
            </div>
          ) : null}

          {disputes ? (
            <div className="pastdisputes">
              <Collapse defaultActiveKey={['0']} ghost>
                <Panel header={'past disputes'} key="1">
                  <div>
                    {pastDisputes ? (
                      <VotingTable votes={pastDisputes} pagination="true" />
                    ) : null}
                  </div>
                </Panel>
              </Collapse>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default VotingModule;
