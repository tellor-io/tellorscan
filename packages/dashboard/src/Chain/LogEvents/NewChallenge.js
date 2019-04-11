import BaseEvent from './BaseEvent';

export default class NewChallenge extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_currentChallenge, _miningApiId, _difficulty_level, _api, _value} = props.returnValues;
    this._currentChallenge = _currentChallenge;
    this._miningApiId = _miningApiId;
    this._difficulty_level = _difficulty_level;
    this._api = _api;
    this._value = _value;
  }

  normalize() {
    let parent = super.normalize();

    let normalized = {
      ...parent,
      id: this._miningApiId,
      queryString: this._api,
      difficulty: this._difficulty_level,
      challengeHash: this._currentChallenge,
      tip: this._value,
      //originalEvent: this,
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
      challengeHash: this._currentChallenge,
      tip: this._value,
    }
  }
}
