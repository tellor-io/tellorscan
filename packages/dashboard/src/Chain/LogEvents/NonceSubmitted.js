import BaseEvent from './BaseEvent';
import * as yup from 'yup';

const _missing = f => {
  return `NonceSubmitted missing field ${f}`;
}

const fieldSchema = yup.object({
  _miner: yup.string().required(_missing("_miner")),
  _nonce: yup.string(),
  _requestId: yup.number().required(_missing("_requestId")),
  _value: yup.number().required(_missing("_value")),
  _currentChallenge: yup.string().required(_missing("_currentChallenge"))
});

const schema = yup.object({
  blockNumber: yup.number().required(_missing("blockNumber")),
  returnValues: fieldSchema
});

export default class NonceSubmitted extends BaseEvent {
  constructor(props) {
    super(props);
    schema.validateSync(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    const {_miner, _nonce, _requestId, _value, _currentChallenge} = props.returnValues;
    this._miner = _miner.toLowerCase();
    this.miner = this._miner;
    this.blockNumber = props.blockNumber;

    this._nonce = _nonce;
    this.nonce = this._nonce;

    this._requestId = this._asNum(_requestId);
    this.id = this._requestId;

    this._value = this._asNum(_value);
    this.value = this._value;

    this._currentChallenge = _currentChallenge;
    this.challengeHash = this._currentChallenge;

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
      blockNumber: this.blockNumber,
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
      blockNumber: this.blockNumber,
      challengeHash: this._currentChallenge,
      winningOrder: this.winningOrder
    }
  }
}
