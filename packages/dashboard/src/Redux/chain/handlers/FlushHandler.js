import {Handler} from 'eth-pipeline';
import {Logger} from 'buidl-utils';

const log = new Logger({component: "FlushHandler"});
export default class FlushHandler extends Handler {
    constructor() {
        super({name: "StorageFlushHandler"});
        [
            'newBlock'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async newBlock(ctx, block, next, reject) {
        log.debug("Getting new block in flush handler");
        
        if(!ctx.recovering) {
            if(typeof ctx.flush === 'function') {
                log.debug("Flushing any stored items...");
                await ctx.flush();
            } 
        } else if(block.isLast || block.flush) {
            if(typeof ctx.flush === 'function') {
                log.debug("Flushing any stored items...");
                await ctx.flush();
            }
        }
        
        return next();
    }
}