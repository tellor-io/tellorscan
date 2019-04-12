import BaseEvent from './BaseEvent';

export default class NonceSubmitted extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_miner, _nonce, _apiId, _value, _currentChallenge} = props.returnValues;
    this._miner = _miner;
    this._nonce = _nonce;
    this._apiId = this._asNum(_apiId);
    this._value = this._asNum(_value);
    this._currentChallenge = _currentChallenge;
    this.winningOrder = -1;
  }

  normalize(props) {
    let parent = super.normalize();

    let payload = {
      ...parent,
      id: this._apiId,
      type: "Mined",
      miner: this._miner,
      nonce: this._nonce,
      value: this._value,
      challengeHash: this._currentChallenge,
      winningOrder: this.winningOrder,
      //originalEvent: this,
      normalize: () => payload
    }
    return payload;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      type: "Mined",
      id: this._apiId,
      miner: this._miner,
      nonce: this._nonce,
      value: this._value,
      challengeHash: this._currentChallenge,
      winningOrder: this.winningOrder
    }
  }
}
