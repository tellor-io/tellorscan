import BaseEvent from './BaseEvent';

export default class NewValue extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    const {_requestId, _time, _value, _currentChallenge} = props.returnValues;
    this._requestId = this._asNum(_requestId);
    this._time = this._asNum(_time);
    this._value = this._asNum(_value);
    this._challengeHash = _currentChallenge;
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._requestId,
      type: "New Value",
      mineTime: this._time,
      value: this._value,
      challengeHash: this._challengeHash,
      normalize: () => payload
    }
    return payload;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      id: this._requestId,
      mineTime: this._time,
      type: "New value",
      challengeHash: this._challengeHash,
      value: this._value,
    }
  }
}
