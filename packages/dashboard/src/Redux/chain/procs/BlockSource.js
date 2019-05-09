import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';
import _ from 'lodash';
import Puller from './EventPuller';

const MAX_BLOCKS = 56000;

/**
 * Block source subscribes to and supplies block data to the
 * event processing flow.
 */
export default class BlockSource {
  constructor() {
    this.missingGaps = [];
    this.id = "BlockSource";

    [
      'init',
      'start',
      'unload',
      '_restoreEvents',
      '_pullEvents',
      '_getLastBlockStored'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  init() {
    return async (dispatch, getState) => {
      //just make sure we have a chain to work from
      let chain = getState().chain.chain;
      if(!chain) {
        throw new Error("Chain was not initialized");
      }

    }
  }

  async _getLastBlockStored() {
    let r = await Storage.instance.readAll({
      database: dbNames.LastBlock,
      limit: 1,
      sort: [
        {
          field: "blockNumber",
          order: 'DESC'
        }
      ]
    });
    return r[0]?r[0].blockNumber+1:0;
  }

  start(next, store) {
    return async (dispatch, getState) => {
      let chain = getState().chain.chain;
      let web3  = chain.web3;
      if(!web3) {
        throw new Error("Web3 not defined in chain");
      }

      //we need to recover events from the last read block
      let start = await this._getLastBlockStored();
      let last = await web3.eth.getBlockNumber();
      let diff = last - start;
      if(diff > MAX_BLOCKS) {
        start = last - MAX_BLOCKS;
      }


      await dispatch(this._restoreEvents({next, store, start, end: last}));

      //clear out any previous subscriptions. This doesn't actually clear MetaMask
      //so not sure if it's really useful.
      await web3.eth.clearSubscriptions();

      //now subscribe to chain for all new blocks and push on demand
      this.sub = web3.eth.subscribe('newBlockHeaders');
      this.subCallback = async (block) => {
        console.log("incoming block", block.number);
        if(block) {
          let last = await this._getLastBlockStored();
          let diff = block.number - last;
          if(diff > MAX_BLOCKS) {
            last = block.number - MAX_BLOCKS;
          }
          await dispatch(this._pullEvents({next, store, start: last, end: block.number+1, block}));
        }
      };

      this.sub.on("data", this.subCallback);
    }
  }

  _restoreEvents({next, store, start, end}) {
    return this._pullEvents({next, store, start, end, block: null, recovering: true});
  }

  _pullEvents(props) {
    const {next, store, start, end, finalEnd, block, recovering} = props;
    return async (dispatch, getState) => {
      let con = getState().chain.contract;
      let web3 = getState().chain.chain.web3;

      let puller = new Puller({
        web3,
        contract: con,
        normalizer: {
          normalize: async (evt, history) => {
            let txn = history[evt.transactionHash];
            if(!txn) {
              let s = Date.now();
              console.log("Retrieving txn...", evt.transactionHash);
              let rec = null;
              try {
                rec = await web3.eth.getTransaction(evt.transactionHash, (e,t)=>{
                  if(e) {
                    console.log("txn receipt Callback error", e);
                  }
                });
              } catch (e) {
                console.log("Problem retrieving transaction", e);
              }

              if(rec) {
                console.log("Retrieved receipt in", (Date.now()-s),"ms");

                txn = {
                  ...rec,
                  transactionHash: evt.transactionHash,
                  __recovering: recovering,
                  logEvents: {}
                };
                history[evt.transactionHash] = txn;
              }
            }

            if(txn) {
              let ex = txn.logEvents[evt.event];
              if(ex) {
                if(!Array.isArray(ex)) {
                  let a = [ex, evt];
                  txn.logEvents[evt.event] = a;
                } else {
                  ex.push(evt);
                }
              } else {
                txn.logEvents[evt.event] = evt;
              }
            }
          }
        }
      });

      let cb = async (e, completeBlock) => {
        if(e) {
          console.log("Problem pulling events", e);

        } else if(completeBlock) {
          store({
            database: dbNames.LastBlock,
            key: "last",
            data: {
              blockNumber: completeBlock.number,
              timestamp: block?block.timestamp:Math.floor(Date.now()/1000)
            }
          });
          try {
              await next({block: completeBlock});
          } catch (e) {
            console.log("Problem sending event block to next proc", e);
          }
        }
      }

      await puller.pullEvents({
        fromBlock: start,
        toBlock: end
      }, cb);


      /*****
      console.log("Pulling events between blocks",start,"-",end);
      let events =  await con.getPastEvents("allEvents", {fromBlock: start, toBlock: end});

      if(!events) {
        events = [];
      }
      console.log("Retrieved", events.length,"events from block",start);
      let txnHistory = {};
      let blockNum = events.length>0?events[0].blockNumber:0;
      let currentBlock = {
        blockNumber: blockNum,
        transactions: []
      };

      for(let i=0;i<events.length;++i) {
        let evt = events[i];

        store({
          database: dbNames.LastBlock,
          key: "last",
          data: {
            blockNumber: evt.blockNumber,
            timestamp: block?block.timestamp:Math.floor(Date.now()/1000)
          }
        });

        if(evt.blockNumber !== blockNum) {
          //new block, convert what we've built up to transaction set
          currentBlock.transactions = _.values(txnHistory);
          //ordered by txn index
          currentBlock.transactions.sort((a,b)=>{
            return a.transactionIndex - b.transactionIndex
          });
          try {
            await next({block: currentBlock});
          } catch (e) {
            console.log("Problem sending event block to next proc", e);
          }
          currentBlock = {
            blockNumber: evt.blockNumber,
            transactions: []
          };
          txnHistory = {};
          blockNum = evt.blockNumber;
        }

        let txn = txnHistory[evt.transactionHash];
        if(!txn) {
          let start = Date.now();
          console.log("Retrieving txn...", evt.transactionHash);
          let rec = null;
          try {
            rec = await web3.eth.getTransaction(evt.transactionHash, (e,t)=>{
              if(e) {
                console.log("txn receipt Callback error", e);
              }
            });
          } catch (e) {
            console.log("Problem retrieving transaction", e);
          }

          if(rec) {
            console.log("Retrieved receipt in", (Date.now()-start),"ms");

            txn = {
              ...rec,
              transactionHash: evt.transactionHash,
              __recovering: recovering,
              logEvents: {}
            };
            txnHistory[evt.transactionHash] = txn;
          }
        }

        if(txn) {
          let ex = txn.logEvents[evt.event];
          if(ex) {
            if(!Array.isArray(ex)) {
              let a = [ex, evt];
              txn.logEvents[evt.event] = a;
            } else {
              ex.push(evt);
            }
          } else {
            txn.logEvents[evt.event] = evt;
          }
        }
      }

      if(_.values(txnHistory).length > 0) {
        //new block, convert what we've built up to transaction set
        currentBlock.transactions = _.values(txnHistory);
        //ordered by txn index
        currentBlock.transactions.sort((a,b)=>{
          return a.transactionIndex - b.transactionIndex
        });
        try {
          await next({block: currentBlock});
        } catch (e) {
          console.log("Problem sending event block to next proc", e);
        }
      }
      ****/

    }
  }

  unload() {
    return  (dispatch, getState) => {
      //just remove subscriptions. This is not guaranteed to be called, unfortunately
      if(this.sub) {
        this.sub.removeListener("data", this.subCallback);
        return new Promise((done,err)=>{
          this.sub.unsubscribe((e,good)=>{
              let now = Date.now();
              let dtStr = new Date(now).toString();
              console.log("Storing shutdown info....");
              Storage.instance.create({
                database: "ShutdownStatus",
                key: ""+now,
                data: {
                  error: e?e.message:null,
                  status: good,
                  time: dtStr
                }
              }).then(()=>{
                console.log("unsubscribe finished");
                done();
              }).catch(e=>{
                err(e);
              })
              this.sub = null;
              this.subCallback = null;
          });
        });

      } else {
        return new Promise((done,err)=>{
          let now = Date.now();
          let dtStr = new Date(now).toString();
          Storage.instance.create({
            database: "ShutdownStatus",
            key: ""+now,
            data: {
              error: "no subscription",
              time: dtStr
            }
          }).then(()=>done())
          .catch(e=>err(e));
        });
      }
    }
  }
}
