










export class Approval extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {owner, spender, value} = props.event.returnValues;
    this.owner = owner;
    this.spender = spender;
    this.value = value;
  }
  normalize(props) {

  }
}

export class Transfer extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {from, to, value} = props.event.returnValues;
    this.from = from ;
    this.to = to;
    this.value = value;
  }
  normalize(props) {

  }
}

export class NewStake extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_sender} = props.event.returnValues;
    this.sender = _sender;
  }
  normalize(props) {

  }
}

export class StakeWithdrawn extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_sender} = props.event.returnValues;
    this.sender = _sender;
  }
  normalize(props) {

  }
}

export class StakeWithdrawRequested extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_sender} = props.event.returnValues;
    this.sender = _sender;
  }
  normalize(props) {

  }
}

export class Voted extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_disputeID, _position, _voter} = props.event.returnValues;
    this.disputeID = _disputeID;
    this.position = _position;
    this.voter = _voter;
  }
  normalize(props) {

  }
}

export class DisputeVoteTallied extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_disputeID, _result, _reportedMiner, _reportingParty, _active} = props.event.returnValues;
    this.disputeID = _disputeID;
    this.totalVotes = _result;
    this.reportedMiner = _reportedMiner;
    this.reportingParty = _reportingParty;
    this.passed = _active;
  }
  normalize(props) {

  }
}

export class NewTellorAddress extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {_newTellor} = props.event.returnValues;
    this.newAddress = _newTellor;
  }
  normalize(props) {

  }
}

export class OwnershipTransferred extends BaseEvent {
  constructor(props) {
    super(props);
    [
      'normalize'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    const {previousOwner, newOwner} = props.event.returnValues;
    this.previousOwner = previousOwner;
    this.newOwner = newOwner;
  }
  normalize(props) {

  }
}
