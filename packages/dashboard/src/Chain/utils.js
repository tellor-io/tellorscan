import * as ethUtils from 'web3-utils';

export const generateQueryHash = (queryString, multi) => {
  return ethUtils.soliditySha3({t:'string',v:queryString},{t:'uint256',v:multi})
}
