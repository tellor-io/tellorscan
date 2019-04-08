import BaseEvent from './BaseEvent';

export default class NewValue extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_apiId, _time, _value} = props.returnValues;
    this._apiId = _apiId;
    this._time = _time;
    this._value = _value;
  }

  normalize() {
    let parent = super.normalize();
    let payload = {
      ...parent,
      id: this._apiId,
      type: "New Value",
      time: this._time,
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
      id: this._apiId,
      time: this._time,
      value: this._value,
    }
  }
}
