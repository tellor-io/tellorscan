export const chains = {
  1: {
    network: 'mainnet',
    subgraphURL: 'https://api.thegraph.com/subgraphs/name/tellor-io/lens',
    apiURL: 'http://api.tellorscan.com/mainnet',
    contractAddr: "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
  },
  4: {
    network: 'rinkeby',
    subgraphURL: 'https://api.thegraph.com/subgraphs/name/tellor-io/lens-rinkeby',
    apiURL: 'http://api.tellorscan.com/rinkeby',
    contractAddr: "0xfe41cb708cd98c5b20423433309e55b53f79134a",
  }
};

export default chains;
