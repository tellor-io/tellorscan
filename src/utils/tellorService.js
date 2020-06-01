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

  async didVote(disputeId, address) {
    if (!this.contract) {
      await this.initContract();
    }

    let didVote = await this.contract.methods
      .didVote(disputeId, address)
      .call();
    return didVote;
  }

  async getMiners(requestId, timestamp) {
    if (!this.contract) {
      await this.initContract();
    }

    let miners = await this.contract.methods
      .getMinersByRequestIdAndTimestamp(requestId, timestamp)
      .call();
    return miners;
  }

  async beginDispute(
    from,
    requestId,
    timestamp,
    minerAddress,
    setTx,
    setError,
  ) {
    // uint256 _requestId, uint256 _timestamp, uint256 _minerIndex
    if (!this.contract) {
      await this.initContract();
    }

    const miners = await this.getMiners(requestId, timestamp);
    const lcMiners = miners.map((m) => m.toLowerCase());
    const minerIndex = lcMiners.indexOf(minerAddress.toLowerCase());

    console.log('dispute service', from, requestId, timestamp, minerIndex);

    let dispute = this.contract.methods
      .beginDispute(requestId, timestamp, minerIndex)
      .send({ from })
      .once('transactionHash', (txHash) => {
        console.log('txHash', txHash);
        setTx(txHash);
      })
      .then((resp) => {
        console.log('resp', resp);
        return resp;
      })
      .catch((err) => {
        console.log('err', err);
        setError({ error: 'rejected transaction', message: err });
      });

    return dispute;
  }

  async vote(from, disputeId, supportsDispute, setTx, setError) {
    // uint256 _disputeId, bool _supportsDispute
    if (!this.contract) {
      await this.initContract();
    }

    console.log('vote service', from, disputeId, supportsDispute);

    let vote = this.contract.methods
      .vote(disputeId, supportsDispute)
      .send({ from })
      .once('transactionHash', (txHash) => {
        setTx(txHash);
      })
      .then((resp) => {
        console.log('resp', resp);
        return resp;
      })
      .catch((err) => {
        console.log('err', err);
        setError({ error: 'rejected transaction', message: err });
      });

    return vote;
  }

  fromWei(value) {
    return this.web3.utils.fromWei(value);
  }
}
