import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';

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
      '_restoreBlocks'
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

      //see if there are any gaps in blocks that we have to
      //recover
      let gaps = await chain.getMissingBlockRanges();
      if(gaps.length > 0) {
        await dispatch(this._restoreBlocks(next, store, gaps));
      }

      //clear out any previous subscriptions. This doesn't actually clear MetaMask
      //so not sure if it's really useful.
      await web3.eth.clearSubscriptions();

      //now subscribe to chain for all new blocks and push on demand
      this.sub = web3.eth.subscribe('newBlockHeaders');
      this.subCallback = async (block) => {
        console.log("incoming block");
        if(block) {
          //if we get a block, grab the block with txns attached
          let wTxns = await getState().chain.chain.web3.eth.getBlock(block.number, true);
          console.log("BlockSource Getting new block", wTxns);

          //remember that we've seen the block
          store({database: dbNames.Blocks, key: ""+block.number, data: {blockNumber: block.number, timestamp: block.timestamp}});

          //pass forward to processors
          await next({block: wTxns});
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
}
