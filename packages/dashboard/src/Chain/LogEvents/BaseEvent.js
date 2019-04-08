export default class BaseEvent {
  constructor(props) {
    [
      'normalize',
      'toJSON'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    this.event = props.event;
    this.name = props.event;
    this.signature = props.signature;
    this.address = props.address;
    this.transactionHash = props.transactionHash;
    this.blockNumber = props.blockNumber;
    this.transiactionIndex = props.transactionIndex;
    this.logIndex = props.logIndex;
    this.timestamp = props.timestamp;
  }

  normalize() {
    return {
      name: this.name || this.event,
      signature: this.signature,
      address: this.address,
      transactionHash: this.transactionHash,
      blockNumber: this.blockNumber,
      timestamp: this.timestamp
    }
  }

  toJSON() {
    return {
      name: this.name || this.event,
      signature: this.signature,
      address: this.address,
      transactionHash: this.transactionHash,
      blockNumber: this.blockNumber,
      timestamp: this.timestamp
    }
  }
}
