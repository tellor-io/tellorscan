import abis from './contracts';

export default class TellorService {
  contractAddr;
  web3;
  abis;
  contract;

  constructor(web3) {
    this.contractAddr = process.env.REACT_APP_TELLOR_CONTRACT_ADDRESS;
    this.web3 = web3;
    this.abis = abis;
  }

  async initContract() {
    this.contract = await new this.web3.eth.Contract(
      this.abis,
      this.contractAddr,
    );
    return this.contract;
  }

  async getCurrentVariables() {
    if (!this.contract) {
      await this.initContract();
    }

    console.log('this.contract', this.contract);
    let variables = await this.contract.methods.getCurrentVariables().call();
    return variables;
  }

  async submitVote(from, proposalIndex, uintVote, encodedPayload) {
    if (!this.contract) {
      await this.initContract();
    }

    if (encodedPayload) {
      const data = this.contract.methods
        .submitVote(proposalIndex, uintVote)
        .encodeABI();
      return data;
    }

    let vote = this.contract.methods
      .submitVote(proposalIndex, uintVote)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });
    return vote;
  }
}
