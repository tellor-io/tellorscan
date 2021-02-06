import React from 'react';
import VotingForm from 'components/voting/VotingForm';

const Upgrade = () => {
  return (
    <>
      <div className="Hero">
        <div className="View">
          <h1 style={{ fontSize: 60, alignContent: 'center' }}>
            Tellor 2.6 Proposal!
          </h1>
          <p>
            TLDR: Fix the difficulty adjustment to be based 4th slot, allowing
            slots 1-4 to be fairly mined. The difficulty for the 5th slot is
            always 1, making it a proof-of-stake slot.
          </p>
          <div style={{ margin: 20 }}>
            <VotingForm dispute={{ disputeId: 54 }} />
          </div>
          <p>
            <a
              href={
                'https://github.com/tellor-io/TIPs/blob/main/TIPs/TIP-6%20Tellor2.6.md'
              }
            >
              {' '}
              See Full Proposal{' '}
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Upgrade;
