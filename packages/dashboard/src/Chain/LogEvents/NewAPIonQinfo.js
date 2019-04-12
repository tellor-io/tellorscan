import BaseEvent from './BaseEvent';

export default class NewAPIonQinfo extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_apiId, _sapi, _apiOnQ, _apiOnQPayout} = props.returnValues;
    this._apiID = this._asNum(_apiId);
    this._sapi = _sapi;
    this._apiOnQ = _apiOnQ;
    this._apiOnQPayout = this._asNum(_apiOnQPayout);
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._apiId,
      queryString: this._sapi,
      queryHash: this._apiOnQ,
      tip: this._apiOnQPayout,
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
      queryString: this._sapi,
      queryHash: this._apiOnQ,
      tip: this._apiOnQPayout
    }
  }
}
