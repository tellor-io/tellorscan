import {Handler} from 'eth-pipeline';
import {Logger} from 'buidl-utils';

const logger = new Logger({component: "ABIDecodeHandler"});

export default class ABIDecodeHandler extends Handler {
    constructor(abis) {
        super({name: "ABIDecodeHandler"});
        if(!abis && !Array.isArray(abis)) {
            throw new Error("Invalid abis. Must be a valid array of ABI definitions");
        } 
        this.fnDefs = {};
        this.evtDefs = {};
        [
            'newBlock',
            '_decodeFn',
            '_decode'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
        abis.forEach(a=>{
            if(a.type === 'function') {
                if(!a.signature) {
                    throw new Error("Invalid ABI. Must have signatures pre-computed for functions/events");
                }
                this.fnDefs[a.signature] = a;
            } else if(a.type === 'event') {
                if(!a.signature) {
                    throw new Error("Invalid ABI. Must have signatures pre-computed for functions/events");
                }
                this.evtDefs[a.signature] = a;
            }
        });
    }

    async newBlock(ctx, block, next, reject) {
        let txns = [];
        block.transactions.forEach(t=>{
          if(!t.logEvents) {
            let events = this._decode(ctx, block, t);
            if(events.length > 0) {
                t.logEvents = events.reduce((o,e)=>{
                    let a = o[e.event] || [];
                    a.push(e);
                    o[e.event] = a;
                    return o;
                }, {});
            }
          }
        });
        return next();
    }


    _decodeFn(ctx, txn) {
        if(txn.input && txn.input.length > 2) {

            //get the fn signature (4-bytes plus 0x)
            let sig = txn.input.substring(0, 10);
            //lookup the fn definition by this sig
            let def = this.fnDefs[sig];
            if(def) {
              //if we found a matching fn, tag the transaction with the
              //fn's name. This will be used downstream as a context for
              //all attached log events
              return def.name;
            }
        }
        return undefined;
    }

    _decode(ctx, block, txn) {
        let out = [];
        let fn = this._decodeFn(ctx, txn);

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
          let def = this.evtDefs[sig];
          if(def) {
            let fields = null;
            try {
              //do actual decode of the log using the definition's input types, the data and
              //remaining indexed topic attributes
              fields = ctx.web3.eth.abi.decodeLog(def.inputs, data, topics);
            } catch (e) {

              logger.error("Problem decoding", e);
              //ignore
            }
            logger.info("FIELDS", fields);
            if(fields) {
              
              //if we have field data, we create a new event locally. This format
              //mimics web3's log event format
              let payload = {
                sender: txn.from?txn.from.toLowerCase():'unknown',
                fnContext: fn,
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
              out.push(payload);
            } else {
              logger.error("Failed to decode event", def.name, log);
            }
          } else {
            logger.error("No log definition with signature", sig, log);
          }
        }
        return out;
    }
}