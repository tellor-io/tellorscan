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

    let variables = await this.contract.methods.getCurrentVariables().call();
    return variables;
  }

  async getBalance(address) {
    if (!this.contract) {
      await this.initContract();
    }

    let balance = await this.contract.methods.balanceOf(address).call();
    return balance;
  }

  async getDisputeFee() {
    if (!this.contract) {
      await this.initContract();
    }

    let disputeFee = await this.contract.methods
      .getUintVar(this.web3.utils.soliditySha3('disputeFee'))
      .call();
    return disputeFee;
  }

  fromWei(value) {
    return this.web3.utils.fromWei(value);
  }

  async beginDispute(from, requestId, timestamp, minderIndex) {
    // uint256 _requestId, uint256 _timestamp, uint256 _minerIndex
    if (!this.contract) {
      await this.initContract();
    }

    let dispute = this.contract.methods
      .beginDispute(requestId, timestamp, minderIndex)
      .send({ from })
      .once('transactionHash', (txHash) => {
        //todo return to component for etherscan link
      })
      .then((resp) => {
        console.log('resp', resp);
        return resp;
      })
      .catch((err) => {
        console.log('err', err);
        return { error: 'rejected transaction' };
      });

    console.log('dispute', dispute);

    return dispute;
  }

  async vote(from, disputeId, supportsDispute) {
    // uint256 _disputeId, bool _supportsDispute
    if (!this.contract) {
      await this.initContract();
    }

    let vote = this.contract.methods
      .submitVote(disputeId, supportsDispute)
      .send({ from })
      .once('transactionHash', (txHash) => {
        //todo return to component for etherscan link
      })
      .then((resp) => {
        console.log('resp', resp);
        return resp;
      })
      .catch((err) => {
        console.log('err', err);
        return { error: 'rejected transaction' };
      });

    console.log('vote', vote);
    return vote;
  }
}
