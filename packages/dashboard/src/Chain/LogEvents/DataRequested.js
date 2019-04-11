import BaseEvent from './BaseEvent';
import {generateQueryHash} from 'Chain/utils';

export default class DataRequested extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize',
      'toJSON',
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    const {sender, _sapi, _granularity,  _apiId,  _value, _symbol} = props.returnValues;
    this.sender = sender;
    this._sapi = _sapi;
    this._granularity = _granularity;
    this._apiId = _apiId;
    this._value = _value-0;
    this._symbol = _symbol?_symbol.toUpperCase():undefined;
    this._queryHash = generateQueryHash(_sapi, _granularity);
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._apiId,
      tip: this._value,
      symbol: this._symbol,
      multiplier: this._granularity,
      queryString: this._sapi,
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
      id: this._apiId,
      tip: this._value,
      symbol: this._symbol,
      multiplier: this._granularity,
      queryString: this._sapi,
      queryHash: this._queryHash,
      sender: this.sender,
      value: this._value
    };
  }
}
