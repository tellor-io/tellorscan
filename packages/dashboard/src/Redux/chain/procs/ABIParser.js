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

/**
 * Parses ABI from transactions and makes them available for
 * processing flows
 */
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
      //for all ABIs installed
      abi.forEach(a=>{

        //look for event and fn definitions so we can use to decode
        if(a.type === 'event') {
          this.eventSigs[a.signature] = a;
        } else if(a.type === 'function') {
          this.fnSigs[a.signature] = a;
        }
      });
    }
  }

  //main proc called during processing of new blocks
  process({block},next) {
    return async (dispatch,getState) => {

      let web3 = getState().chain.chain.web3;
      let txns = block.transactions;

      //for all transactions in a block
      for(let i=0;i<txns.length;++i) {
        let t = txns[i];
        //tag the transaction as recovery mode. This means
        //past blocks are being re-processed so it might change
        //processor behavior
        t.__recovering = block.__recovering;

        //if there is input data for the transaction
        if(t.input && t.input.length > 2) {

          //get the fn signature (4-bytes plus 0x)
          let sig = t.input.substring(0, 10);

          //lookup the fn definition by this sig
          let def = this.fnSigs[sig];
          if(def) {
            //if we found a matching fn, tag the transaction with the
            //fn's name. This will be used downstream as a context for
            //all attached log events
            t.fn = def.name;
          }
        }

        //if the txn is giong to our contract
        if(t.to && t.to.toLowerCase() === DEFAULT_MASTER_CONTRACT) {

          //get the receipt which will contain our logs
          let rcpt = await web3.eth.getTransactionReceipt(t.hash);
          if(rcpt) {
            //if the txn failed, ignore it
            if(!rcpt.status) {
              continue;
            }

            //attach receipt to txn
            t.receipt = rcpt;

            //add timestamp to each txn for easier ref downstream
            t.timestamp = block.timestamp;

            //decode log events
            let logEvents = await dispatch(this._decode(block, t));

            //attach to transaction
            t.logEvents = logEvents;

            //attach to txn as a map keyed by event name
            t.logEventMap = createEventMap(logEvents);
          }
        }
      }//end txn enrichment loop

      //can next proc in flow
      return next({block});
    }
  }

  /**
   * Decode any logs in the transaction's receipt
   */
  _decode(block, txn) {
    return (dispatch, getState) => {
      let web3 = getState().chain.chain.web3;
      let out = [];
      let logs = txn.receipt.logs;
      //for all logs in the receipt
      for(let i=0;i<logs.length;++i) {
        let log = logs[i];

        //get the topic part of the event. Topic contains the
        //event signature and up to three indexed attributes
        let topics = log.topics;

        //all remaining attributes are held in data part of log
        let data = log.data;

        //pull the sig as the first topic
        let sig = topics.shift();

        //see if we know about it
        let def = this.eventSigs[sig];
        if(def) {
          let fields = null;
          try {
            //do actual decode of the log using the definition's input types, the data and
            //remaining indexed topic attributes
            fields = web3.eth.abi.decodeLog(def.inputs, data, topics);
          } catch (e) {
            //ignore
          }
          if(fields) {
            //if we have field data, we create a new event locally. This format
            //mimics web3's log event format
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
            //instantiate our internal event type
            let evt = eventFactory(payload);
            if(evt) {
              //and make it part of result
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
