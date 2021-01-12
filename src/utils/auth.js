import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { getChainData } from './chains';

const getChainIdName = (chainId) => {
  switch (chainId) {
    case 1:
      return 'Mainnet';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 5:
      return 'Goerli';
    case 42:
      return 'Kovan';
    case 4447:
      return 'Ganache';
    default:
      return 'Unknown';
  }
};

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_KEY,
      // infuraId: process.env.REACT_APP_INFURA_URI.split('/').pop(),
    },
  },
};

export const w3connect = async (web3Modal, currentNetwork) => {
  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);
  const injectedChainId = await web3.eth.getChainId();
  if (injectedChainId !== +currentNetwork) {
    alert(
      `Please switch Web3 to the correct network and try signing in again. Detected network: ${getChainData(injectedChainId).network
      }, Required network: ${getChainData(+currentNetwork).network}`,
    );
    throw new Error(
      `Injected web3 chainId: ${injectedChainId}, config: ${+currentNetwork}`,
    );
  }
  web3.autoRefreshOnNetworkChange = false;
  return { web3Modal, web3, provider };
};

export const signInWithWeb3 = async (currentNetwork) => {
  const web3Modal = new Web3Modal({
    network: getChainData(+currentNetwork).network, // optional
    providerOptions, // required
    cacheProvider: true,
  });

  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);
  const injectedChainId = await web3.eth.getChainId();

  if (injectedChainId !== +currentNetwork) {
    alert(
      `Please switch Web3 to the correct network and try signing in again. Detected network: ${getChainIdName(
        injectedChainId,
      )}, Required network: ${getChainIdName(+currentNetwork)}`,
    );
    throw new Error(
      `Injected web3 chainId: ${injectedChainId}, config: ${+currentNetwork}`,
    );
  }

  return { web3Modal, web3, provider };
};

export const createWeb3User = (accountAddress) => {
  return {
    type: 'web3',
    username: accountAddress,
  };
};
