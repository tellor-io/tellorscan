import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object().shape({
  contract: yup.object().required("Missing contract"),
  web3: yup.object().required("Missing web3"),
  normalizer: yup.object().required("Missing event normalizer")
});

export default class EventPuller {
  constructor(props) {
    schema.validateSync(props);
    this.abi = props.abi;
    this.web3 = props.web3;
    this.options = props.options;
    this.eventName = props.eventName;
    this.normalizer = props.normalizer;
    this.contract = props.contract;
    [
      'pullEvents',
      '_doPull'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  pullEvents({fromBlock, toBlock}, cb) {
    return new Promise(async (done,err)=>{
      let ctx = {
        start: fromBlock,
        end: toBlock,
        history: {},
        increment: 0,
        finalEnd: toBlock,
        done,
        err
      };
      this._doPull(ctx, cb);
    });
  }

  async _doPull(ctx, cb) {
    if(ctx.start > ctx.end) {
      throw new Error("Start block is after end block: " + ctx.start + " > " +ctx.end);
    }
    let span = ctx.end - ctx.start;
    console.log("Querying for logs in range", ctx.start, "-", ctx.end);
    let config = {
      ...this.options,
      fromBlock: ctx.start,
      toBlock: ctx.end,
      address: this.address
    };

    try {
      let evtName = this.eventName || "allEvents";
      let start = Date.now();
      let events = await this.contract.getPastEvents(evtName, config);

      console.log("Retrieved", events.length, "events in", (Date.now()-start),"ms");

      //assumption is the contract pre-sorts blocks so we can normalize and then announce based on
      //block changes
      let block = events.length>0?events[0].blockNumber:0;
      let fromChain = await this.web3.eth.getBlock(block);
      let currentBlock = {
        number: block,
        transactions: [],
        timestamp: fromChain.timestamp
      };

      for(let i=0;i<events.length;++i) {
        let evt = events[i];
        evt.timestamp = currentBlock.timestamp;

        if(evt.blockNumber !== block) {
          fromChain = await this.web3.eth.getBlock(evt.blockNumber);
          //new block, convert what we've built up to transaction set
          currentBlock.transactions = _.values(ctx.history);
          //ordered by txn index
          currentBlock.transactions.sort((a,b)=>{
            return a.transactionIndex - b.transactionIndex
          });
          try {
            await cb(null, currentBlock);
          } catch (e) {
            console.log("Problem sending event block to callback", e);
            throw e;
          }
          currentBlock = {
            number: evt.blockNumber,
            transactions: [],
            timestamp: fromChain.timestamp
          };
          ctx.history = {};
          block = evt.blockNumber;
        }
        try {
          await this.normalizer.normalize(evt,ctx.history);
        } catch (e) {
          console.log("Problem normalizing", e);
          await cb(e);
          throw e;
        }

      }

      if(_.values(ctx.history).length > 0) {
        //new block, convert what we've built up to transaction set
        currentBlock.transactions = _.values(ctx.history);
        //ordered by txn index
        currentBlock.transactions.sort((a,b)=>{
          return a.transactionIndex - b.transactionIndex
        });
        try {
          await cb(null, currentBlock);
        } catch (e) {
          console.log("Problem sending event block to callback", e);
          await cb(e);
          throw e;
        }
      }

      if(ctx.finalEnd > ctx.end) {
        //means we had to split into sub-queries
        let next = {
          ...ctx,
          start: ctx.end+1,
          end: ctx.end + 1 + Math.ceil(ctx.increment)
        };
        console.log("Going to next pull segment", next);
        return this._doPull(next, cb)

      } else {

        ctx.done();
      }

    } catch (e) {
      if(e.message.includes("more than 1000 results")) {
        console.log("Have to split query apart");
        if(span <= 1) {
          //we've already reduced it as much as we can reduce
          //the span so have to bail out.
          throw e;
        }
        //otherwise, cut the span in 1/2 and try again
        let newSpan = Math.ceil(span/2);
        if(newSpan === 0) {
          throw e;
        }

        console.log("Split into", {
          ...ctx,
          increment: newSpan,
          end: newSpan + ctx.start
        });

        if(newSpan + ctx.start === ctx.start) {
          throw e;
        }

        return this._doPull({
          ...ctx,
          increment: newSpan,
          end: newSpan + ctx.start
        }, cb);


      } else {
        ctx.err(e);
      }
    }
  }
}
