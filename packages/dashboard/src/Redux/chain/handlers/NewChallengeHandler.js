import {Handler} from 'eth-pipeline';
import * as DBNames from 'Storage/DBNames';
import {Logger} from 'buidl-utils';
import {Creators as chCreators} from 'Redux/challenges/actions';
import {default as chOps} from 'Redux/challenges/operations';
import Factory from 'Chain/LogEvents/EventFactory';
import _ from 'lodash';
import {dedupeNonces} from 'Chain/utils';

const log = new Logger({component: "NewChallengeHandler"});

export default class NewChallengeHandler extends Handler {
    constructor() {
        super({name: "NewChallengeHandler"});
        [
            'newBlock',
            '_addNewChallenges',
            '_addNonces',
            '_addValues'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async newBlock(ctx, block, next) {
        let txns = block.transactions || [];
        for(let i=0;i<txns.length;++i) {
            let t = txns[i];
            let logEvents = t.logEvents || {};
            let events = logEvents[DBNames.NewChallenge] || [];
            await this._addNewChallenges(ctx, events);
            
            await this._addNonces(ctx, logEvents);
            await this._addValues(ctx, logEvents);
        }
       
        let raw = ctx.cache.get(DBNames.NewChallenge) || {};
        let challenges = Object.keys(raw).map(hash=>{
            let ch = raw[hash];
            let byMiner = ch.noncesByMiner || {};
            return {
                ...ch,
                nonces: Object.keys(byMiner).map(m=>byMiner[m])
            }
        });
        
        
        if(challenges.length > 0) {
            let current = await ctx.helpers.getCurrentChallenge();
            let hash = current?current.challengeHash:null;
            ctx.dispatch(chCreators.addChallenges(challenges, hash));
        }
       
       return next();
    }

    async _addNewChallenges(ctx, events) {
       
        for(let j=0;j<events.length;++j) {
            let ch =  Factory({
                event: DBNames.NewChallenge, 
                ...events[j]
            });
           
            let test = ctx.getState().challenges.byHash[ch.challengeHash];
            if(test) {
               continue; //already have it
            }

            ctx.store({
                database: DBNames.NewChallenge, 
                key: ch.challengeHash,
                data: ch.toJSON()
            });
            
            let req = await ctx.helpers.findRequestById(ch.id);
            
            if(!req) {
                log.warn("Could not find NewChallenge matching data request with id", ch.id);
                break;
            }

            await ctx.cache.reduce(DBNames.NewChallenge, state=>{
                return {
                    ...state,
                    [ch.challengeHash]: ch
                }
            });
        }
    }

    async _addNonces(ctx, logEvents) {
        //let nonces = ctx.cache.get(DBNames.NonceSubmitted) || [];
        let nonces = logEvents[DBNames.NonceSubmitted] || [];
        nonces = nonces.map(n=>Factory({
            event: DBNames.NonceSubmitted,
            ...n
        }));

        nonces = dedupeNonces(nonces);
        
        for(let i=0;i<nonces.length;++i) {
            let n = nonces[i];
            let ch = ctx.getState().challenges.byHash[n.challengeHash];
            if(!ch) {
                //check local set 
                let local = ctx.cache.get(DBNames.NewChallenge) || {};
                let c = local[n.challengeHash];
                if(c) {
                    let byMiner = c.noncesByMiner || {};
                    byMiner = {
                        ...byMiner,
                        [n.miner]: n
                    };
                    c = {
                        ...c,
                        noncesByMiner: byMiner
                    }
                    await ctx.reduce(DBNames.NewChallenge, state=>{
                        return {
                            ...state,
                            [n.challengeHash]: c
                        }
                    });
                }
            } else {
                log.info("Adding nonces to challenge", ch.nonces?ch.nonces.length:0, n);
                await ctx.dispatch(chOps.addNonceToChallenge(ch, n));
            }
        }
    }

    async _addValues(ctx, logEvents) {
        let values = logEvents[DBNames.NewValue] || [];
        values = values.map(v=>Factory({
            event: DBNames.NewValue,
            ...v
        }));
        
        for(let i=0;i<values.length;++i) {
            let v = values[i];
            let ch = ctx.getState().challenges.byHash[v.challengeHash];
            if(ch) {
                await ctx.dispatch(chOps.addValueToChallenge(ch, v));
            } else {
                let local = ctx.cache.get(DBNames.NewChallenge) || {};
                let c = local[v.challengeHash];
                if(c) {
                    c = {
                        ...c,
                        finalValue: v
                    }
                    await ctx.cache.reduce(DBNames.NewChallenge, state=>{
                        return {
                            ...state,
                            [v.challengeHash]: c
                        }
                    });
                }
            }
        }
    }
}