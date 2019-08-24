import {Handler} from 'eth-pipeline';
import * as DBNames from 'Storage/DBNames';
import {Logger} from 'buidl-utils';
import {Creators as chCreators} from 'Redux/challenges/actions';
import Factory from 'Chain/LogEvents/EventFactory';

const log = new Logger({component: "MissingDataTracker"});

export default class MissingDataTracker extends Handler {
    constructor() {
        super({name: "MissingDataTracker"});
        [
            'newBlock'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async newBlock(ctx, block, next) {
        if(!ctx.recovering || block.isLast) {
            //we need to make sure that all but the latest challenge has 5 nonces
            let byHashes = ctx.getState().challenges.byHash;
            let hashes = Object.keys(byHashes);
            for(let i=0;i<hashes.length;++i) {
                let hash = hashes[i];
                let ch = byHashes[hash];
                let nonces = ch.nonces;
                if(!nonces || nonces.length < 5) {
                    log.warn("Challenge is missing all its nonces", ch);
                }
            }
        }
    }
}