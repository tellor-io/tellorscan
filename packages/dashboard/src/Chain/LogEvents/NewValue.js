import BaseEvent from './BaseEvent';
import * as yup from 'yup';

const _missing = f => {
  return `NewValue is missing field ${f}`;
}
const fieldSchema = yup.object({
  _requestId: yup.number().required(_missing("_requestId")),
  _time: yup.number().required("_time"),
  _currentChallenge: yup.string().required(_missing("_currentChallenge"))
});

const schema = yup.object({
  returnValues: fieldSchema,
  blockNumber: yup.number().required(_missing("blockNumber"))
});

export default class NewValue extends BaseEvent {
  constructor(props) {
    super(props);
    schema.validateSync(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    const {_requestId, _time, _value, _currentChallenge} = props.returnValues;
    this._requestId = this._asNum(_requestId);
    this.id = this._requestId;
    this.blockNumber = props.blockNumber;

    this._time = this._asNum(_time);
    this.mineTime = this._time;

    this._value = this._asNum(_value);
    this.value = this._value;

    this._challengeHash = _currentChallenge;
    this.challengeHash = this._challengeHash;
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._requestId,
      type: "New Value",
      mineTime: this._time,
      blockNumber: this.blockNumber,
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
      blockNumber: this.blockNumber,
      type: "New value",
      challengeHash: this._challengeHash,
      value: this._value,
    }
  }
}
