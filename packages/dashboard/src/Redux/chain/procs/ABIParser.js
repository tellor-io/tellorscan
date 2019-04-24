import abi from 'Chain/abi';
import {
  DEFAULT_MASTER_CONTRACT
} from 'Constants/chain/web3Config';
import eventFactory from 'Chain/LogEvents/EventFactory';

const createEventMap = logs => {
  return logs.reduce((o,e)=>{
    let ex = o[e.event];
    if(ex) {
      if(Array.isArray(ex)) {
        ex.push(e);
      } else {
        o[e.event] = [ex, e];
      }
    } else {
      o[e.event] = e;
    }
    return o;
  },{});
}

export default class ABIParser {
  constructor() {
    this.id = "ABIParser";

    [
      'init',
      'process',
      '_decode'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  init() {
    return async (dispatch,getState) => {
      let chain = getState().chain.chain;
      if(!chain) {
        throw new Error("Chain was not initialized");
      }
      let web3 = chain.web3;
      if(!web3) {
        throw new Error("Chain does not have a web3");
      }
      this.eventSigs = {};
      this.fnSigs = {};
      abi.forEach(a=>{
        if(a.type === 'event') {
          //console.log("Registering event", a.signature, a.name);
          this.eventSigs[a.signature] = a;
        } else if(a.type === 'function') {
          //console.log("Registering fn", a.signature, a.name);
          this.fnSigs[a.signature] = a;
        }
      });
    }
  }

  process({block},next) {
    return async (dispatch,getState) => {

      let web3 = getState().chain.chain.web3;
      let txns = block.transactions;

      for(let i=0;i<txns.length;++i) {
        let t = txns[i];
        t.__recovering = block.__recovering;

        if(t.input && t.input.length > 2) {
          let sig = t.input.substring(0, 10);
          let def = this.fnSigs[sig];
          if(def) {
            t.fn = def.name;
          }
        }
        if(t.to && t.to.toLowerCase() === DEFAULT_MASTER_CONTRACT) {
          let rcpt = await web3.eth.getTransactionReceipt(t.hash);
          if(rcpt) {
            if(!rcpt.status) {
              continue;
            }
            
            t.receipt = rcpt;

            let logEvents = await dispatch(this._decode(block, t));
            t.logEvents = logEvents;
            t.logEventMap = createEventMap(logEvents);
          }
        }
      }
      return next({block});
    }
  }

  _decode(block, txn) {
    return (dispatch, getState) => {
      let web3 = getState().chain.chain.web3;
      let out = [];
      let logs = txn.receipt.logs;
      for(let i=0;i<logs.length;++i) {
        let log = logs[i];
        let topics = log.topics;
        let data = log.data;
        let sig = topics.shift();
        let def = this.eventSigs[sig];
        if(def) {
          let fields = null;
          try {
            fields = web3.eth.abi.decodeLog(def.inputs, data, topics);
          } catch (e) {
            //ignore
          }
          if(fields) {
            let payload = {
              sender: txn.from.toLowerCase(),
              fnContext: txn.fn,
              transactionHash: txn.hash,
              blockNumber: block.number,
              transactionIndex: txn.transactionIndex,
              signature: sig,
              address: log.address?log.address.toLowerCase():undefined,
              logIndex: i,
              timestamp: block.timestamp,
              event: def.name,
              returnValues: fields
            };
            let evt = eventFactory(payload);
            if(evt) {
              out.push(evt);
            }
          } else {
            console.log("Failed to decode event", def.name);
          }
        } else {
          console.log("WARNING: no log definition with signature", sig);
        }
      }
      return out;
    }
  }
}
