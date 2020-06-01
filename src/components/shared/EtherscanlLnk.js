import React from 'react';

const EtherscanLink = ({ txHash }) => {
  const uri =
    process.env.REACT_APP_NETWORK_ID === '1'
      ? 'https://etherscan.io/tx/'
      : 'https://rinkeby.etherscan.io/tx/';

  return (
    <div>
      <a href={`${uri}${txHash}`} target="_blank" rel="noopener noreferrer">
        View on Etherscan
      </a>
    </div>
  );
};

export default EtherscanLink;
