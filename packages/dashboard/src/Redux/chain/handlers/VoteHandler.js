import {Handler} from 'eth-pipeline';
import * as DBNames from 'Storage/DBNames';
import Factory from "Chain/LogEvents/EventFactory"
import {Logger} from 'buidl-utils';
import {default as dispOps} from 'Redux/disputes/operations';
import {default as voteOps} from 'Redus/votes/operations';
import * as ethUtils from 'web3-utils';

const log = new Logger({component: "VoteHandler"});

export default class VoteHandler extends Handler {
    constructor(props) {
        super({name: "VoteHandler"});
    }

    newBlock = async(ctx, block, next, reject) => {
        let txns = block.transactions || [];
        for(let i=0;i<txns.length;++i) {
            let t = txns[i];
            let logEvents = t.logEvents || {};
            let vtEvents = logEvents[DBNames.Voted] || [];
            if(vtEvents.length === 0) {
                continue;
            }

            let vote = Factory({
                event: DBNames.Voted,
                ...vtEvents[0]
            });
           
            let d = await ctx.helpers.findDisputeForVote(vote.id);
            if(!d) {
                log.warn("Could not find matching dispute for vote");
            }

            ctx.store({
                database: DBNames.Voted,
                key: ""+vote.id + "_" + vote.voter,
                data: vote.toJSON()
            });
            
            await ctx.cache.reduce(DBNames.Voted, state=>{
                if(!state) {
                    state = [];
                }
                return [
                    ...state,
                    vote
                ]
            });
        }

        let all = ctx.cache.get(DBNames.Voted);
        if(all && all.length > 0) {
            await ctx.dispatch(voteOps.addVotes(all));
        }

        return next();
    }
}