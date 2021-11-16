import React, { useState } from 'react';

const Upgrade = ({ currentUser }) => {
  //Globals
  //No voteId currently on Mainnet
  //voteId 78 is essentially empty right now Nov 16, 2021
  const voteIdMainnet = 78;
  const voteIdRinkeby = 26;

  //Component State
  const [justVoted, setJustVoted] = useState(false);

  // console.log(currentUser && currentUser.contracts.instance.methods);

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
          className="View"
          style={{
            padding: '100px 180px',
          }}
        >
          <h1 style={{ fontSize: 60, alignContent: 'center' }}>
            Tellor X Proposal!
          </h1>
          <h2>
            TL;DR: Tellor is upgrading to TellorX. Vote in support of this, just
            do it!
          </h2>
          <h3>
            <a href="https://www.tellor.io/static/media/tellorX-whitepaper.f6527d55.pdf">
              Link to Whitepaper
            </a>
          </h3>
          <div
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
                  <h2>
                    Click here to vote in opposition of the TellorX Upgrade
                  </h2>
                  <button onClick={() => handleVote(false)} className="ant-btn">
                    Vote in Opposition
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
