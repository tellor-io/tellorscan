import React, { useContext } from 'react';
import { NetworkContext } from 'contexts/Network';

const EtherscanLink = ({ className, txHash }) => {
  const [currentNetwork] = useContext(NetworkContext);
  const uri =
    +currentNetwork === 1
      ? 'https://etherscan.io/tx/'
      : 'https://rinkeby.etherscan.io/tx/';

  return (
    <div className={className}>
      <a href={`${uri}${txHash}`} target="_blank" rel="noopener noreferrer">
        View on Etherscan
      </a>
    </div>
  );
};

export default EtherscanLink;
