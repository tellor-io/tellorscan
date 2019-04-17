import BaseEvent from './BaseEvent';

export default class NewChallenge extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_currentChallenge, _currentRequestId, _difficulty, _multiplier,  _query,  _totalTips} = props.returnValues;
    this._currentChallenge = _currentChallenge;
    this._multiplier = this._asNum(_multiplier);
    this._currentRequestId = this._asNum(_currentRequestId);
    this._difficulty = this._asNum(_difficulty);
    this._query = _query;
    this._value = this._asNum(_totalTips);
  }

  normalize() {
    let parent = super.normalize();
    let normalized = {
      ...parent,
      id: this._currentRequestId,
      queryString: this._query,
      difficulty: this._difficulty,
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
      id: this._currentRequestId,
      queryString: this._query,
      difficulty: this._difficulty,
      challengeHash: this._currentChallenge,
      multiplier: this._multiplier,
      tip: this._value
    }
  }
}
