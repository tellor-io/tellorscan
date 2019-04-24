import BaseEvent from './BaseEvent';

export default class Voted extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_disputeID, _position, _voter} = props.returnValues;
    this._disputeID = this._asNum(_disputeID);
    this.id = this._disputeID;

    this._position = _position;
    this.agreesWithDisputer = this._position;
    this.position = this._position;

    this._voter = _voter.toLowerCase();
    this.voter = this._voter;
  }

  normalize() {
    let parent = super.normalize();
    let normalized = {
      ...parent,
      id: this._disputeID,
      agreesWithDisputer: this._position,
      voter: this._voter,
      position: this.position,
      normalize: () => normalized
    }

    return normalized;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      id: this._disputeID,
      agreesWithDisputer: this._position,
      position: this.position,
      voter: this._voter
    }
  }
}
