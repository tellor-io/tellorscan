import * as dbNames from 'Storage/DBNames';

export default class BlockSource {
  constructor() {
    this.missingGaps = [];
    this.id = "BlockSource";

    [
      'init',
      'start',
      'unload'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  init() {
    return async (dispatch, getState) => {
      let chain = getState().chain.chain;
      if(!chain) {
        throw new Error("Chain was not initialized");
      }

    }
  }

  unload() {
    return async (dispatch, getState) => {
      if(this.sub) {
        this.sub.removeListener("data", this.subCallback);
        await this.sub.unsubscribe((e,good)=>{
          console.log("Unsubscribed to blocks", good, e);
        });
        this.sub = null;
        this.subCallback = null;
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

      //recover from any gaps in the chain
      let gaps = await chain.getMissingBlockRanges();
      console.log("Starting BlockSource");

      console.log("Recovering block gaps", gaps);
      let followons = [];
      for(let i=0;i<gaps.length;++i) {
        let g = gaps[i];
        for(let j=g.start;j<=g.end;++j) {
          console.log("Retrieving missing block", j);
          let start = Date.now();
          let block = await web3.eth.getBlock(j, true);
          console.log("Block retrieved in ", (Date.now()-start),"ms");
          if(block) {
            store({database: dbNames.Blocks, key: ""+block.number, data: {blockNumber: block.number, timestamp: block.timestamp}});

            followons.push(next({block: {
              ...block,
              __recovering: true
            }}));
          }
        }
      }
      await Promise.all(followons);
      await web3.eth.clearSubscriptions();

      //TODO: do replay once more to capture any events that arrived while
      //we were recovering gaps. This is make up for lengthy recovery time.
      //this follow up should capture any remaining items quickly.
      //gaps = await chain.getMissingBlockRanges();
      //while(gaps.length > 0) {
      //     ...
      //   gaps = await.chain.getMissingBlockRanges();
      //}

      //now subscribe to chain for all new blocks and push on demand
      this.sub = web3.eth.subscribe('newBlockHeaders');
      this.subCallback = async (block) => {
        if(block) {
          let wTxns = await getState().chain.chain.web3.eth.getBlock(block.number, true);
          console.log("BlockSource Getting new block", wTxns);
          store({database: dbNames.Blocks, key: ""+block.number, data: {blockNumber: block.number, timestamp: block.timestamp}});
          next({block: wTxns});
        }
      };

      this.sub.on("data", this.subCallback);
    }
  }
}
