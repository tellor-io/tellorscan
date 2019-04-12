import EventEmitter from 'events';
import * as eventTypes from './LogEvents';
import _ from 'lodash';
import Storage from 'Storage';
import eventFactory from 'Chain/LogEvents/EventFactory';

export default class SubscriptionProvider {
  constructor(props) {
    this.chain = props.chain;
    this.allListeners = [];

    [
      'once',
      'allEvents',
      '_sub',
      '_filterAndNotify'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    //treat each defined event type as a function that user can
    //subscribe to.
    _.keys(eventTypes).forEach(nm=>{

      //just create subscription for event name
      this[nm] = (opts, cb) => {
        return this._sub(nm, opts, cb);
      };

      this.chain.on(nm, async (e)=>{
        if(e) {
          let actual = e;
          if(!e.normalize) {
            actual = eventFactory(e);
          }

          //store all incoming events
          await Storage.instance.create({
            database: actual.event,//event name === db name
            key: actual.transactionHash,
            data: actual.toJSON()
          });

          if(this.allListeners.length > 0) {

            if(actual) {
              let norm = actual.normalize();
              this.allListeners.forEach(al=>{
                this._filterAndNotify(al.options, al.callback, norm);
              });
            } else {
              console.log("Could not decode to actual log event", e);
            }
          }
        }
      });

      //then bind the new function to this class
      this[nm] = this[nm].bind(this);
    });

  }

  async once(event, opts) {
    //event is name or 'allEvents' for any
    //opts has filter, topics array
    throw new Error("contractLogic.events.once not supported yet");
  }

  async allEvents(opts, cb)  {
    this.allListeners.push({
      options: opts,
      callback: cb
    });
  }


  _filterAndNotify(opts, cb, event, emitter) {
    let filter = opts?opts.filter:{};
    if(!filter) {
      filter = {};
    }
    if(!cb) {
      cb = ()=>{}
    }
    if(!emitter) {
      emitter = {
        emit: () => {}
      }
    }

    let props = _.keys(filter);
    if(props.length > 0) {
      props.forEach(k=>{
        let tgtVal = filter[k];
        let val = event[k];
        if(val) {
          if(Array.isArray(tgtVal)) {
            tgtVal.forEach(v=>{
              if(v === val) {
                cb(null, event);
                emitter.emit("data", event);
              }
            })
          } else if(val === tgtVal) {
            cb(null, event);
            emitter.emit("data", event);
          }
        }
      })
    } else {
      cb(null, event);
      emitter.emit("data", event);
    }
  }

  _sub(name, opts, cb) {
    let emitter = new EventEmitter();
    this.chain.on(name, (e)=>{
      if(e) {
        this._filterAndNotify(opts, cb, e, emitter);
      }
    });
    return emitter;
  }
}
