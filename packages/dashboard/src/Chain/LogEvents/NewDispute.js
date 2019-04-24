import BaseEvent from './BaseEvent';
import {generateDisputeHash} from 'Chain/utils';

export default class NewDispute extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    const {_disputeId, _requestId, _timestamp, _miner} = props.returnValues;
    this._timestamp = this._asNum(_timestamp);
    this.mineTime = this._timestamp;

    this._requestId = this._asNum(_requestId);
    this.requestId = this._requestId;

    this._disputeId = this._asNum(_disputeId);
    this.id = this._disputeId;

    this._miner = _miner.toLowerCase();
    this.miner = this._miner;

    this._disputeHash = generateDisputeHash({requestId: this._requestId, miner: this._miner, timestamp: this._timestamp});
    this.disputeHash = this._disputeHash;
  }

  normalize() {
    let parent = super.normalize();
    let normalized = {
      ...parent,
      id: this._disputeId,
      requestId: this._requestId,
      mineTime: this._timestamp,
      miner: this._miner,
      disputeHash: this._disputeHash,
      normalize: () => normalized
    }

    return normalized;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      id: this._disputeId,
      requestId: this._requestId,
      mineTime: this._timestamp,
      miner: this._miner,
      disputeHash: this._disputeHash
    }
  }
}
