import BaseEvent from './BaseEvent';

export default class TipAdded extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  
    const {_sender, _requestId, _tip, _totalTips} = props.returnValues;
    this._sender = _sender;
    this._requestId = this._asNum(_requestId);
    this._tip = this._asNum(_tip);
    this._totalTips = this._asNum(_totalTips);
  }

  normalize() {
    let parent = super.normalize();

    let payload = {
      ...parent,
      id: this._requestId,
      tip: this._tip,
      totalTips: this._totalTips,
      sender: this._sender,
      normalize: () => payload
    }
    return payload;
  }

  toJSON() {
    let parent = super.toJSON();
    return {
      ...parent,
      id: this._requestId,
      tip: this._tip,
      totalTips: this._totalTips,
      sender: this._sender,
    }
  }
}
