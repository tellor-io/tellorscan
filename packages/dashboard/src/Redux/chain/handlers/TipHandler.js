import {Handler} from 'eth-pipeline';
import * as DBNames from 'Storage/DBNames';
import Factory from "Chain/LogEvents/EventFactory"
import {Logger} from 'buidl-utils';
import {getCurrentTipForRequest} from 'Chain/utils';
import {Creators} from 'Redux/tips/actions';

const log = new Logger({component: "TipHandler"});

export default class TipHandler extends Handler {
    constructor(props) {
        super({name: "TipHandler"});
        [
            'newBlock'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async newBlock(ctx, block, next, reject) {
        let txns = block.transactions || [];
        for(let i=0;i<txns.length;++i) {
            let t = txns[i];
            let logEvents = t.logEvents || {};
            let tipEvents = logEvents[DBNames.TipAdded] || [];
            
            for(let j=0;j<tipEvents.length;++j) {
                
                let tip = tipEvents[j];
                let tipEvt = Factory({
                    event: DBNames.TipAdded, 
                    ...tip
                });
                let req = await ctx.helpers.findRequestById(tipEvt.id);
                
                if(!req) {
                    log.error("Could not find request with id", tipEvt.id);
                } else {

                    let tip = tipEvt.totalTips;
                    if(!ctx.recovering) {
                        //we go back on chain to get the actual current tip because the
                        //total tips has been wrong in early versions. If this gets slow
                        //let's check the total tips again or fix it on contract.
                        tip = await ctx.dispatch(getCurrentTipForRequest(req.id));
                        if(!tip) {
                            tip  = 0;
                        }
                    }

                    //remember the tip event for future recovery
                    await ctx.store({
                        database: DBNames.TipAdded,
                        key: tipEvt.transactionHash,
                        data: tipEvt.toJSON()
                    });
                   
                    await ctx.cache.reduce(DBNames.TipAdded, (state)=>{
                        
                        if(!state) {
                            state = [];
                        }
                        let tips = [
                            ...state,
                            tipEvt
                        ];
                        //only keep last 50 tips. Note that we shift from the
                        //front of the list to keep latest tips
                        while(tips.length > 50) {
                            tips.shift();
                        }
                        
                        return tips
                    });
                }
            }
        }
        log.info("Getting cached tips...");
        let tips = ctx.cache.get(DBNames.TipAdded);
        log.info("Tips retrieved",tips?tips.length:0);
        if(tips && tips.length > 0) {
            ctx.dispatch(Creators.addTips(tips));
        }
        
        return next();
    }
}