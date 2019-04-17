import BaseEvent from './BaseEvent';

export default class Voted extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_disputeID, _position, _voter} = props.event.returnValues;
    this.disputeID = _disputeID;
    this.position = _position;
    this.voter = _voter;
  }

  normalize() {
    let parent = super.normalize();
    let normalized = {
      ...parent,
      id: this._disputeID,
      agreesWithDisputer: this._position,
      voter: this._voter,
      normalize: () => normalized
    }

    return normalized;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      id: this._disputeID,
      agreesWithMiner: this._position,
      voter: this._voter
    }
  }
}
