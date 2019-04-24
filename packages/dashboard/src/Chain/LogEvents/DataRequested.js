import BaseEvent from './BaseEvent';
import {generateQueryHash} from 'Chain/utils';

export default class DataRequested extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize',
      'toJSON',
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {sender, _query, _querySymbol, _granularity,  _requestId,  _totalTips} = props.returnValues;
    this.sender = sender;
    this._query = _query;
    this.queryString = _query;

    this._granularity = this._asNum(_granularity);
    this.multiplier = this._granularity;

    this._requestId = this._asNum(_requestId);
    this.id = this._requestId;

    this._value = this._asNum(_totalTips);
    this.value = this._value;

    this._symbol = _querySymbol?_querySymbol.toUpperCase():undefined;
    this.symbol = this._symbol;

    this._queryHash = generateQueryHash(_query, this._granularity);
    this.queryHash = this._queryHash;
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._requestId,
      tip: this._value,
      symbol: this._symbol,
      multiplier: this._granularity,
      queryString: this._query,
      sender: this.sender,
      value: this._value,
      queryHash: this._queryHash,
      //originalEvent: this,
      normalize: () => payload
    }
    return payload;
  }

  toJSON() {

    let parent = super.toJSON();
    return {
      ...parent,
      id: this._requestId,
      tip: this._value,
      symbol: this._symbol,
      multiplier: this._granularity,
      queryString: this._query,
      queryHash: this._queryHash,
      sender: this.sender,
      value: this._value
    };
  }
}
