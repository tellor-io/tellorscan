export default class BaseEvent {
  constructor(props) {
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    this.event = props.event;
    this.signature = props.signature;
    this.address = props.address;
    this.transactionHash = props.transactionHash;
    this.blockNumber = props.blockNumber;
    this.timestamp = props.timestamp;
  }

  normalize() {
    return {
      name: this.event,
      signature: this.signature,
      address: this.address,
      transactionHash: this.transactionHash,
      blockNumber: this.blockNumber,
      timestamp: this.timestamp
    }
  }

  toJSON() {
    return {
      event: this.event,
      signature: this.signature,
      address: this.address,
      transactionHash: this.transactionHash,
      blockNumber: this.blockNumber,
      timestamp: this.timestamp
    }
  }
}
