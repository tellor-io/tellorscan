import {Handler} from 'eth-pipeline';
import * as DBNames from 'Storage/DBNames';
import {Logger} from 'buidl-utils';
import Factory from 'Chain/LogEvents/EventFactory';
import {default as newValOps} from 'Redux/newValues/operations';


const log = new Logger({component: "NewValueHandler"});

export default class NewValueHandler extends Handler {
    constructor() {
        super({name: "NewValueHandler"});
        [
            'newBlock'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async newBlock(ctx, block, next) {
        let txns = block.transactions || [];
        for(let i=0;i<txns.length;++i) {
            let t = txns[i];
            let logEvents = t.logEvents || {};
            let events = logEvents[DBNames.NewValue];
            if(!events || events.length === 0) {
                continue;
            }
            let newVal = Factory({
                event: DBNames.NewValue,
                ...events[0]
            }); //only one per txn

            let req = await ctx.helpers.findRequestById(newVal.id);
            if(!req) {
                log.warn("Unable to find request for new value with id:", newVal.id);
                continue;
            }
            let challenge = await ctx.helpers.findOrCreateChallenge(req.id, newVal.challengeHash);
            if(!challenge) {
                log.warn("Unable to find challenge with hash:", newVal.challengeHash);
                continue;
            }


          // let miners = await ctx.helpers.getMiningOrder(newVal);
            let miners = []; //we don't need the lookup but leave as placemarker
            ctx.store({
                database: DBNames.NewValue,
                key: newVal.challengeHash,
                data: newVal.toJSON()
            });

            await ctx.cache.reduce(DBNames.NewValue, (state) => {
                if(!state) {
                    state = [];
                }
                let newVals = [
                    ...state
                ];
                newVals.push({
                    newValue: newVal,
                    miners
                });
                
                return newVals;
            });
        }
        let newVals = ctx.cache.get(DBNames.NewValue);
        if(newVals) {
            ctx.dispatch(newValOps.addNewValues(newVals));
        }
           
        return next();
    }
}