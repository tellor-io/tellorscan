import BaseEvent from './BaseEvent';

export default class NewAPIonQinfo extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_apiId, _sapi, _apiOnQ, _apiOnQPayout} = props.returnValues;
    this._apiID = _apiId;
    this._sapi = _sapi;
    this._apiOnQ = _apiOnQ;
    this._apiOnQPayout = _apiOnQPayout;
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._apiId,
      queryString: this._sapi,
      queryHash: this._apiOnQ,
      tip: this._apiOnQPayout,
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
        _apiId: this._apiId,
        _sapi: this._sapi,
        _apiOnQ: this._apiOnQ,
        _apiOnQPayout: this._apiOnQPayout
      }
    }
  }
}
