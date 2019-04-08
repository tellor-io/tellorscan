import BaseEvent from './BaseEvent';

export default class TipUpdated extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {sender, _apiId,  _value} = props.returnValues;
    this.sender = sender;
    this._apiId = _apiId;
    this._value = _value;
  }

  normalize() {
    let parent = super.normalize();

    let payload = {
      ...parent,
      id: this._apiId,
      tip: this._value,
      sender: this.sender,
      originalEvent: this,
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
      sender: this.sender,
    }
  }
}
