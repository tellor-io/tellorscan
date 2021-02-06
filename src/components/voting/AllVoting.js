import React from 'react';

import VotingTable from './VotingTable';

const AllVoting = ({ votes }) => {
  return (
    <>
      <div className="TableHeader">
        <h2>Voting</h2>
      </div>
      <VotingTable pagination={true} votes={votes} />
    </>
  );
};

export default AllVoting;
