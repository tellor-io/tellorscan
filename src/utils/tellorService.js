import * as abiLatest from 'contracts/tellorLatest/tellorLatest.json';
import * as abiMaster from 'contracts/tellorMaster/tellorMaster.json';


export default class TellorService {

  constructor(web3, addr) {
    let abis = abiLatest.default.concat(abiMaster.default)
    this.addr = addr;
    this.web3 = web3;
    this.instance = new web3.eth.Contract(abis, addr);
  }

  balanceOf(address) {
    return this.instance.methods.balanceOf(address)
      .call().then(result => { return result });
  }

  balanceOfAt(address, blockNumber) {
    return this.instance.methods.balanceOfAt(address, blockNumber)
      .call().then(result => { return result });
  }

  dispute

  didVote(disputeId, address) {
    return this.instance.methods
      .didVote(disputeId, address)
      .call().then(result => { return result });
  }

  getMiners(requestId, timestamp) {
    return this.instance.methods
      .getMinersByRequestIdAndTimestamp(requestId, timestamp)
      .call().then(result => { return result });
  }

  beginDispute(
    from,
    requestId,
    timestamp,
    minerIndex,
    setTx,
    setError,
  ) {
    // uint256 _requestId, uint256 _timestamp, uint256 _minerIndex
    // const miners = this.getMiners(requestId, timestamp).then(result => { return result });
    // const lcMiners = miners.map((m) => m.toLowerCase());
    // const minerIndex = lcMiners.indexOf(minerAddress.toLowerCase());

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
        setError({ error: 'rejected transaction', message: err });
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
        setError({ error: 'rejected transaction', message: err });
      });

    return vote;
  }
}
