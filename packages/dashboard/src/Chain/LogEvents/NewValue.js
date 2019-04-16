import BaseEvent from './BaseEvent';

export default class NewValue extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_apiId, _time, _value, _currentChallenge} = props.returnValues;
    this._apiId = this._asNum(_apiId);
    this._time = this._asNum(_time);
    this._value = this._asNum(_value);
    this._challengeHash = _currentChallenge;
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._apiId,
      type: "New Value",
      time: this._time,
      value: this._value,
      challengeHash: this._challengeHash,
      //originalEvent: this,
      normalize: () => payload
    }
    return payload;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      id: this._apiId,
      time: this._time,
      type: "New value",
      challengeHash: this._challengeHash,
      value: this._value,
    }
  }
}
