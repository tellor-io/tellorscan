import BaseEvent from './BaseEvent';
import * as yup from 'yup';

const _missing = (fld) => `TipAdded missing field ${fld}`;

const fieldSchema = yup.object({
  _sender: yup.string().required(_missing("_sender")),
  _requestId: yup.number().required(_missing("_requestId")),
  _tip: yup.number().required(_missing("_tip")),
  _totalTips: yup.number().required(_missing("_totalTips"))
});

const schema = yup.object({
  blockNumber: yup.number().required(_missing("blockNumber")),
  returnValues: fieldSchema
});

export default class TipAdded extends BaseEvent {
  constructor(props) {
    super(props);
    schema.validateSync(props);

    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_sender, _requestId, _tip, _totalTips} = props.returnValues;
    this._sender = _sender;
    this.sender = this._sender;
    this.blockNumber = props.blockNumber;

    this._requestId = this._asNum(_requestId);
    this.id = this._requestId;

    this._tip = this._asNum(_tip);
    this.tip = this._tip;

    this._totalTips = this._asNum(_totalTips);
    this.totalTips = this._totalTips;
  }

  normalize() {
    let parent = super.normalize();

    let payload = {
      ...parent,
      id: this._requestId,
      tip: this._tip,
      totalTips: this._totalTips,
      sender: this._sender,
      blockNumber: this.blockNumber,
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
      blockNumber: this.blockNumber,
      sender: this._sender,
    }
  }
}
