export default class BaseEvent {
  constructor(props) {
    [
      'normalize',
      'toJSON',
      '_asNum'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    this.sender = props.sender;
    this.fnContext = props.fnContext || props.fn;
    this.event = props.event;
    this.name = props.event;
    this.signature = props.signature;
    this.address = props.address;
    this.transactionHash = props.transactionHash;
    this.blockNumber = this._asNum(props.blockNumber);
    this.transactionIndex = this._asNum(props.transactionIndex);
    this.logIndex = this._asNum(props.logIndex);
    this.timestamp = this._asNum(props.timestamp);
  }

  _asNum(v) {
    if(!v) {
      return v;
    }

    if(v.toString) {
      return v.toString()-0;
    }
    return v;
  }

  normalize() {
    return {
      fnContext: this.fnContext,
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
      sender: this.sender,
      fnContext: this.fnContext,
      name: this.name || this.event,
      signature: this.signature,
      address: this.address,
      transactionHash: this.transactionHash,
      blockNumber: this.blockNumber,
      timestamp: this.timestamp
    }
  }
}
