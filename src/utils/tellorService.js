import abis from './contracts';

export default class TellorService {
  contractAddr;
  web3;
  abis;
  contract;

  constructor(web3, currentNetwork) {
    this.contractAddr =
      currentNetwork === '1'
        ? '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5'
        : '0xfe41cb708cd98c5b20423433309e55b53f79134a';
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
