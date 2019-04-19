import BaseEvent from './BaseEvent';

export default class NonceSubmitted extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    const {_miner, _nonce, _requestId, _value, _currentChallenge} = props.returnValues;
    this._miner = _miner.toLowerCase();
    this._nonce = _nonce;
    this._requestId = this._asNum(_requestId);
    this._value = this._asNum(_value);
    this._currentChallenge = _currentChallenge;
    this.winningOrder = -1;
  }

  normalize(props) {
    let parent = super.normalize();

    let payload = {
      ...parent,
      id: this._requestId,
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
      id: this._requestId,
      miner: this._miner,
      nonce: this._nonce,
      value: this._value,
      challengeHash: this._currentChallenge,
      winningOrder: this.winningOrder
    }
  }
}
