import {Handler} from 'eth-pipeline';
import {Logger} from 'buidl-utils';
import * as DBNames from 'Storage/DBNames';

const log = new Logger({component: "LastBlockHandler"});

export default class LastBlockHandler extends Handler {
    constructor() {
        super({name: "LastBlockHandler"});
        this.lastBlock = 0;
        [
            'newBlock'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async newBlock(ctx, block, next) {
        let num = block.number;

        //Because initialization requires events from a caching service, the service may not be in 
        //sync with the head of the chain. If we saved the highest block, and then attempt to refresh
        //the app, the caching service may not have events ingested at the later block and we would 
        //miss data. We therefore back up a few blocks to give the caching service some time to index events.
        num -= 4; 
        log.debug("This block", block.number, "Last block", this.lastBlock);
        if(num > this.lastBlock) {
            log.info("Storing last block as", num,"so we can recover with overlapping blocks on restart");
            this.lastBlock = num;
            await ctx.store({
                database: DBNames.LastBlock,
                key: "last",
                data: {
                    blockNumber: num,
                    timestamp: block.timestamp?block.timestamp:Math.floor(Date.now()/1000)
                }
            })
        }
        return next();
    }
}