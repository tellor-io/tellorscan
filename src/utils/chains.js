export const chains = {
  1: {
    network: 'mainnet',
    subgraphURL: 'https://api.thegraph.com/subgraphs/name/tellor-io/lens',
    apiURL: 'http://api.tellorscan.com/mainnet',
    contractAddr: "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0",
  },
  4: {
    network: 'rinkeby',
    subgraphURL: 'https://api.thegraph.com/subgraphs/name/tellor-io/lens-rinkeby',
    apiURL: 'http://api.tellorscan.com/rinkeby',
    contractAddr: "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0",
  }
};

export default chains;
