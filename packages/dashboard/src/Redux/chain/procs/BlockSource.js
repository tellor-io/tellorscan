import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';
import _ from 'lodash';

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
      '_restoreBlocks',
      '_restoreEvents',
      '_pullEvents'
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

  start(next, store) {
    return async (dispatch, getState) => {
      let chain = getState().chain.chain;
      let web3  = chain.web3;
      if(!web3) {
        throw new Error("Web3 not defined in chain");
      }

/*****
      //see if there are any gaps in blocks that we have to
      //recover
      let gaps = await chain.getMissingBlockRanges();
      if(gaps.length > 0) {
        await dispatch(this._restoreBlocks(next, store, gaps));
      }
****/
      //we need to recover events from the last read block
      let r = await Storage.instance.readAll({
        database: "lastBlock",
        limit: 1,
        sort: [
          {
            field: "blockNumber",
            order: 'DESC'
          }
        ]
      });
      console.log("last block results", r);
      let start = r[0]?r[0].blockNumber+1:0;
      let last = await web3.eth.getBlockNumber();
      let diff = last - start;
      if(diff > MAX_BLOCKS) {
        start = last - MAX_BLOCKS;
      }

      await dispatch(this._restoreEvents(next, store, start));



      //clear out any previous subscriptions. This doesn't actually clear MetaMask
      //so not sure if it's really useful.
      await web3.eth.clearSubscriptions();

      //now subscribe to chain for all new blocks and push on demand
      this.sub = web3.eth.subscribe('newBlockHeaders');
      this.subCallback = async (block) => {
        console.log("incoming block");
        if(block) {
          await dispatch(this._pullEvents(next, store, block.number, block));

          /*
          //if we get a block, grab the block with txns attached
          let wTxns = await getState().chain.chain.web3.eth.getBlock(block.number, true);
          console.log("BlockSource Getting new block", wTxns);

          //remember that we've seen the block
          store({database: dbNames.Blocks, key: ""+block.number, data: {blockNumber: block.number, timestamp: block.timestamp}});

          //pass forward to processors
          await next({block: wTxns});
          */
        }
      };

      this.sub.on("data", this.subCallback);
    }
  }

  /**
   * Attempt to restore missing blocks
   */
  _restoreBlocks(next, store, gaps) {
    return async (dispatch, getState) => {
      if(gaps.length === 0) {
        return;
      }

      let chain = getState().chain.chain;
      let web3 = chain.web3;
      let followons = [];

      //for each gap we need to rebuild
      for(let i=0;i<gaps.length;++i) {
        let g = gaps[i];
        //for the block numbers within the gap
        for(let j=g.start;j<=g.end;++j) {
          console.log("Retrieving missing block", j);
          let start = Date.now();

          //grab the block from chain
          let block = await web3.eth.getBlock(j, true);
          console.log("Block retrieved in ", (Date.now()-start),"ms");
          if(block) {
            //remember that we've seen the block
            store({database: dbNames.Blocks, key: ""+block.number, data: {blockNumber: block.number, timestamp: block.timestamp}});

            //and pass the block on to the next processor, flagging it as
            //recovery since we're actually processing old blocks
            followons.push(next({block: {
              ...block,
              __recovering: true
            }}));
          }
        }
      }
      //wait for all blocks to process
      await Promise.all(followons);

      //We need to try again to capture any events that arrived while
      //we were recovering gaps. This makes up for lengthy recovery times.
      //this follow up should capture any remaining items quickly.
      gaps = await chain.getMissingBlockRanges();
      if(gaps.length > 0) {
        return this._restoreBlocks(next, store, gaps);
      }
    }
  }

  _restoreEvents(next, store, startBlock) {
    return this._pullEvents(next, store, startBlock, null, true);
  }

  _pullEvents(next, store, startBlock, block, recovering) {
    return async (dispatch, getState) => {
      let con = getState().chain.contract;
      let web3 = getState().chain.chain.web3;


      let events = await con.getPastEvents("allEvents", {fromBlock: startBlock});
      console.log("Retrieved", events.length,"events from block",startBlock);
      let txnHistory = {};
      let blockNum = events.length>0?events[0].blockNumber:0;
      let currentBlock = {
        blockNumber: blockNum,
        transactions: []
      };

      for(let i=0;i<events.length;++i) {
        let evt = events[i];
        store({
          database: dbNames.Blocks,
          key: ""+evt.blockNumber,
          data: {
            blockNumber: evt.blockNumber,
            timestamp: block?block.timestamp:Math.floor(Date.now()/1000)
          }
        });
        store({
          database: "lastBlock",
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
          let rec = await web3.eth.getTransaction(evt.transactionHash);

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
              let a = [ex];
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

    }
  }
}
