import BaseEvent from './BaseEvent';

export default class NewChallenge extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_currentChallenge, _miningApiId, _difficulty_level, _multiplier,  _api,  _value} = props.returnValues;
    this._currentChallenge = _currentChallenge;
    this._multiplier = this._asNum(_multiplier);
    this._miningApiId = this._asNum(_miningApiId);
    this._difficulty_level = this._asNum(_difficulty_level);
    this._api = _api;
    this._value = this._asNum(_value);
  }

  normalize() {
    let parent = super.normalize();
    let normalized = {
      ...parent,
      id: this._miningApiId,
      queryString: this._api,
      difficulty: this._difficulty_level,
      challengeHash: this._currentChallenge,
      multiplier: this._multiplier,
      tip: this._value,
      normalize: () => normalized
    }

    return normalized;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      id: this._miningApiId,
      queryString: this._api,
      difficulty: this._difficulty_level,
      multiplier: this._multiplier,
      challengeHash: this._currentChallenge,
      tip: this._value,
    }
  }
}
