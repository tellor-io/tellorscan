import React from 'react';

import VoteForm from './VoteForm';
const VotingOn = ({  }) => {
  return (
    <div className="Voting">
        <VoteForm dispute={{disputeId
        : 46}} />
         <p><a href={"https://github.com/tellor-io/TIPs/blob/main/TIPs/TIP-2%20Tellor2.5.md"}> See Proposal </a></p>
    </div>
  );
};

export default VotingOn;