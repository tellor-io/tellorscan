import React from 'react';
import VoteForm from 'components/votes/VoteForm';

const Mining = () => {

  return (
    <>
    <div className="Hero">
      <div className="View">
        <h1 style={{fontSize:60, alignContent: "center"}}>
          Tellor 2.5 Proposal
        </h1>
        <p>
        TLDR:
        Staking reduced from 1000 TRB to 500 TRB 
        Current miner reward changed fron 1 TRB + tips to 1 TRB + tips + timeSinceLastMineValue/5Min
        </p>
      <div style={{margin:20}}>

      <VoteForm dispute={{disputeId
        : 46}} />
      </div>
         <p><a href={"https://github.com/tellor-io/TIPs/blob/main/TIPs/TIP-2%20Tellor2.5.md"}> See Full Proposal </a></p>
      </div>
    </div>
    </>
  );
};

export default Mining;
