import React, { useState, useEffect } from 'react';
import './upgrade.scss';

const Upgrade = ({ currentUser }) => {
  //Globals
  //No voteId currently on Mainnet
  //voteId 78 is essentially empty right now Nov 16, 2021
  const voteIdMainnet = 78;
  const voteIdRinkeby = 26;

  //Component State
  const [justVoted, setJustVoted] = useState(false);

  //Adds comment for new page update

  useEffect(() => {
    if (justVoted) {
      alert('Thanks for voting, you can now safely exit the page.');
    }
  }, [justVoted]);

  //Handlers
  const handleVote = async (bool) => {
    if (currentUser) {
      const didAlreadyVote = await currentUser.contracts.instance.methods
        .didVote(voteIdRinkeby, currentUser.address)
        .call();

      if (!didAlreadyVote) {
        if (currentUser.address && currentUser.network === 1) {
          await currentUser.contracts.instance.methods
            .vote(voteIdMainnet, bool)
            .send({ from: currentUser.address });
          setJustVoted(true);
        } else if (currentUser.address && currentUser.network === 4) {
          // alert('Please sign in on Mainnet to vote!');
          await currentUser.contracts.instance.methods
            .vote(voteIdRinkeby, bool)
            .send({ from: currentUser.address });
          setJustVoted(true);
        }
      } else if (currentUser && didAlreadyVote) {
        alert('You already voted at this address. Thank you for voting!');
      }
    } else {
      alert(
        'Please sign in with the green connect button and MetaMask to cast your vote!',
      );
    }
  };

  return (
    <>
      <div className="Hero">
        <div
          className="View Upgrade"
          style={{
            padding: '100px 180px',
          }}
        >
          <h1 style={{ fontSize: 60, alignContent: 'center' }}>
            TellorX Upgrade - Community Vote
          </h1>
          <div className="subheaders">
            <h2>
              A new oracle design, decentralized governance and treasury
              features adds even more robustness to Tellor.
            </h2>
            <h3>
              The vote to upgrade Tellor starts November 23rd and runs seven
              days until November 30.
            </h3>
          </div>
          <h4>
            All TRB holders are eligible and encouraged to vote! Make sure to
            have your TRB in an Ethereum wallet before the voting starts.
          </h4>
          <div className="upgradeSummaryList">
            <h4>TellorX upgrade summary:</h4>
            <li>Data reported in bytes, supporting virtually any request.</li>
            <li>Easier to launch Tellor on other blockchains.</li>
            <li>Moves from proof-of-work to proof-of-stake model.</li>
            <li>
              Data reporter staking requirement decreases to 100 TRB from 500
              TRB.
            </li>
            <li>
              Tellor treasuries adds TRB rewards for staking and participating
              in community governance.
            </li>
          </div>

          <a href="https://www.tellor.io/static/media/tellorX-whitepaper.f6527d55.pdf">
            Read more about the TellorX upgrade in the whitepaper here.
          </a>

          <div
            className="buttonContainer"
            style={{
              marginTop: '50px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {justVoted ? (
              <h1>{`Thanks for voting ${
                currentUser ? currentUser.address : 'Tellor enthusiast'
              }!`}</h1>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <h2>Click here to vote in favor of the TellorX Upgrade</h2>
                  <button onClick={() => handleVote(true)} className="ant-btn">
                    Vote in Favor
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <h2>Click here to vote against the TellorX Upgrade</h2>
                  <button
                    onClick={() => handleVote(false)}
                    className="opposition"
                  >
                    Vote Against
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Upgrade;
