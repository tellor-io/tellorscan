import React from 'react';

//TODOS:

// [] Get current TRB value from address to see if they have enough to vote.
//////// [] currentAddress.TRB token amount
//////// [] what's the TRB amount needed to vote?
// [] Be able to handle Rinkeby and Mainnet or just Rinkeby?
// [] Have a button that votes on the contract method when clicked.
//////// [] whats the contract method?
// [] Find out what the method needs as parameters
//////// [] vote Id 78, right?
// [] Have a way to display current state of vote?
//////// [] curent votes for/against?
// [] Use web3 for this

// Use iTellorABI?

const Upgrade = ({ currentUser }) => {
  //Globals
  const voteId = 78;

  //Handlers
  const handleVote = async (bool) => {
    if (currentUser) {
      if (currentUser.address && currentUser.network === 1) {
        const vote = await currentUser.contracts.instance.methods
          .vote(voteId, bool)
          .send({ from: currentUser.address });
        // console.log(vote);
        return vote;
      } else if (currentUser.address && currentUser.network === 4) {
        alert('Please sign in on Mainnet to vote!');
      }
    } else {
      alert(
        'Please sign in with MetaMask, via the green connect button, to vote!',
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
              <h2>Click here to vote in opposition of the TellorX Upgrade</h2>
              <button onClick={() => handleVote(false)} className="ant-btn">
                Vote in Opposition
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upgrade;
