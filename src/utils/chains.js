export const supportedChains = [
  {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ETH',
    network: 'mainnet',
    chain_id: 1,
    network_id: 1,
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/tellor-io/lens',
  },
  {
    name: 'Ethereum Rinkeby',
    short_name: 'rin',
    chain: 'ETH',
    network: 'rinkeby',
    chain_id: 4,
    network_id: 4,
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/tellor-io/lens-rinkeby',
  }
];

export function getChainData(chainId) {
  const chainData = supportedChains.filter(
    (chain) => chain.chain_id === +chainId,
  )[0];

  if (!chainData) {
    throw new Error('ChainId missing or not supported');
  }

  const API_KEY = process.env.REACT_APP_INFURA_PROJECT_ID;

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}

export default supportedChains;
