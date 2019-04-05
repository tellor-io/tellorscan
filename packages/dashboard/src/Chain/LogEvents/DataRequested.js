import BaseEvent from './BaseEvent';

export default class DataRequested extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    const {sender, _sapi, _granularity,  _apiId,  _value} = props.returnValues;
    this.sender = sender;
    this._sapi = _sapi;
    this._granularity = _granularity;
    this._apiId = _apiId;
    this._value = _value-0;
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._apiId,
      tip: this._value,
      symbol: "not set yet",
      multiplier: this._granularity,
      queryString: this._sapi,
      sender: this.sender,
      value: this._value,
      originalEvent: this,
      normalize: () => payload
    }
    return payload;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      returnValues: {
        sender: this.sender,
        _sapi: this._sapi,
        _granularity: this._granularity,
        _apiId: this._apiId,
        _value: this._value
      }
    }
  }
}
