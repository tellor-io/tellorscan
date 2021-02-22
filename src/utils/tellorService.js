import * as abiOracle from 'contracts/oracle.json';

export default class TellorService {
  constructor(web3, addr) {
    let abi = abiOracle.default
    this.addr = addr;
    this.web3 = web3;
    this.instance = new web3.eth.Contract(abi, addr);
  }

  balanceOf(address) {
    return this.instance.methods.balanceOf(address)
      .call().then(result => { return result });
  }

  balanceOfAt(address, blockNumber) {
    return this.instance.methods.balanceOfAt(address, blockNumber)
      .call().then(result => { return result });
  }

  migrate(from, setTx) {
    return this.instance.methods
      .migrate()
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
        throw e.toString(err)
      });
  }

  isMigrated(address) {
    return this.instance.methods
      .migrated(address)
      .call().then(result => { return result });
  }

  didVote(disputeId, address) {
    return this.instance.methods
      .didVote(disputeId, address)
      .call().then(result => { return result });
  }

  beginDispute(
    from,
    requestId,
    timestamp,
    minerIndex,
    setTx,
  ) {

    let dispute = this.instance.methods
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
        throw err.toString()
      });

    return dispute;
  }

  vote(from, disputeId, supportsDispute, setTx, setError) {
    // uint256 _disputeId, bool _supportsDispute
    let vote = this.instance.methods
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
        throw err.toString()
      });

    return vote;
  }
}
