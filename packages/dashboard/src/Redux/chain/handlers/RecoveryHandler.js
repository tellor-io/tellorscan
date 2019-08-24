import {Handler} from 'eth-pipeline';
import {Logger} from 'buidl-utils';

const log = new Logger({component: "RecoveryHandler"});

export default class RecoveryHandler extends Handler {
    constructor(props) {
        super({name: "RecoveryHandler"});
        
        this.defaultToAddress = props.defaultToAddress;
        this.lastBlock = props.lastBlock;
        if(!this.lastBlock) {
            throw new Error("Need the last block in recovery");
        }
        
        [
            'newBlock'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async newBlock(ctx, block, next, reject) {
        let recovering = false;
        block.isLast = block.number === this.lastBlock;
        block.transactions.forEach(t=>{
            if(!t.to && !t.from) {
                recovering = true;
                t.to = this.defaultToAddress
            }
            if(!t.receipt) {
                t.receipt = {}; //make sure something is there so we don't retrieve downstream.
            }
        });
        ctx.recovering = recovering;
        return next();
    }
}