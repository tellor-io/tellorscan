import {Handler} from 'eth-pipeline';
import * as DBNames from 'Storage/DBNames';
import {Logger} from 'buidl-utils';
import Factory from 'Chain/LogEvents/EventFactory';
import {Creators as nonceCreators} from 'Redux/nonces/actions';
import * as ethUtils from 'web3-utils';
import _ from 'lodash';
import Storage from 'Storage';
import {dedupeNonces} from 'Chain/utils';

const log = new Logger({component: "NonceSubmitHandler"});

export default class NonceSubmitHandler extends Handler {
    constructor() {
        super({name: "NonceSubmitHandler"});
        [
            'newBlock'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async newBlock(ctx, block, next, reject) {
        let txns = block.transactions || [];
        
        for(let i=0;i<txns.length;++i) {
            let t = txns[i];
            let logEvents = t.logEvents || {};
            let nonces = logEvents[DBNames.NonceSubmitted];
            if(!nonces) {
                continue;
            }
            let ch = null;
            for(let j=0;j<nonces.length;++j) {
                let nonce = Factory({event: DBNames.NonceSubmitted, ...nonces[j]});

                let req = await ctx.helpers.findRequestById(nonce.id);
                
                if(!req) {
                    log.warn("Could not find matching request for nonce submission", nonce.id);
                    break;
                }

                let ch = await ctx.helpers.findOrCreateChallenge(nonce.id, nonce.challengeHash);
                if(!ch) {
                    log.warn("Could not find or create challenge for nonce with hash:",nonce.challengeHash,"and requestId:",nonce.id)
                    break;
                }
                
                await ctx.cache.reduce(DBNames.NonceSubmitted, state=>{
                    if(!state) {
                        state = [];
                    }
                    return [
                        ...state,
                        nonce
                    ]
                });

                ctx.store({
                    database: DBNames.NonceSubmitted,
                    key: ethUtils.sha3(nonce.challengeHash + nonce.miner),
                    data: nonce.toJSON()
                });
            }
        }

        
        let nonces = ctx.cache.get(DBNames.NonceSubmitted);
        
        if(nonces && nonces.length > 0) {
            
            let byHash = nonces.reduce((o,n)=>{
                let a = o[n.challengeHash] || []
                a.push(n);
                a = dedupeNonces(a);
                o[n.challengeHash] = a;
                return o;
            },{});
            let hashes = Object.keys(byHash);
            for(let i=0;i<hashes.length;++i) {
                let hash = hashes[i];
                let matches = byHash[hashes[i]].map(n=>n.toJSON());
                let current = await Storage.instance.read({
                    database: DBNames.NoncesByHash,
                    key: hash
                });
               
                if(!current) {
                    current = [];
                }
                current = [
                    ...current,
                    ...matches
                ]
                let all = dedupeNonces(current);
                if(all.length > 0) {
                    ctx.store({
                        database: DBNames.NoncesByHash,
                        key: hash,
                        data: all
                    });
                }
            }
            
            await ctx.dispatch(nonceCreators.addNonces(nonces));
        }
        
        return next();
    }
}