import BaseEvent from './BaseEvent';
import * as yup from 'yup';
import {Logger} from 'buidl-utils';

const log = new Logger({component: "NewChallengeEvent"});

const _missing = f => {
  return `NewChallenge is missing field ${f}`;
}

const fieldSchema = yup.object({
  _currentChallenge: yup.string().required(_missing("_currentChallenge")),
  _currentRequestId: yup.number().required(_missing("_currentRequestId")),
  _difficulty: yup.string(),
  _multiplier: yup.number().required(_missing("_mulitiplier")),
  //_query: yup.string().required(_missing("_query")),
  _totalTips: yup.number()
});

const schema = yup.object({
  returnValues: fieldSchema,
  blockNumber: yup.number().required(_missing("blockNumber"))
});

export default class NewChallenge extends BaseEvent {
  constructor(props) {
    super(props);
    try {
      schema.validateSync(props);
    } catch (e) {
      log.error("Problem with incoming challenge props", e, props);
      throw e;
    }
    

    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_currentChallenge, _currentRequestId, _difficulty, _multiplier,  _query,  _totalTips} = props.returnValues;
    this._currentChallenge = _currentChallenge;
    this.challengeHash = this._currentChallenge;
    this.blockNumber = props.blockNumber;

    this._multiplier = this._asNum(_multiplier);
    this.multiplier = this._multiplier;

    this._currentRequestId = this._asNum(_currentRequestId);
    this.id = this._currentRequestId;

    this._difficulty = this._asNum(_difficulty);
    this.difficulty = this._difficulty;

    this._query = _query;
    this.queryString = this._query;

    this._value = this._asNum(_totalTips);
    this.tip = this._value;
  }

  normalize() {
    let parent = super.normalize();
    let normalized = {
      ...parent,
      id: this._currentRequestId,
      blockNubmer: this.blockNumber,
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
      blockNumber: this.blockNumber,
      queryString: this._query,
      difficulty: this._difficulty,
      challengeHash: this._currentChallenge,
      multiplier: this._multiplier,
      tip: this._value
    }
  }
}
