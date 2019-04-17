import * as ethUtils from 'web3-utils';

export const generateQueryHash = (queryString, multi) => {
  return ethUtils.soliditySha3({t:'string',v:queryString},{t:'uint256',v:multi})
}

export const generateDisputeHash = ({requestId, miner, timestamp}) => {
  return ethUtils.soliditySha3({t: 'address', v:miner},{t:'uint256',v:requestId},{t:'uint256',v:timestamp});
}
