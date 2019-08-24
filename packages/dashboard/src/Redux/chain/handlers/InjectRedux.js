import {Handler} from 'eth-pipeline';
import {Logger} from 'buidl-utils';

const log = new Logger({component: "InjectRedux"});

export default class InjectRedux extends Handler {
    constructor(props) {
        super({name: "InjectReduxHandler"});
        this.dispatch = props.dispatch;
        this.getState = props.getState;
        this.cachedState = {};
        this.finalizers = {};
        [
            'init',
            'newBlock',
            '_addCache'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async init(ctx, next) {
        ctx.dispatch = this.dispatch;
        ctx.getState = this.getState;
        this._addCache(ctx);
        return next();
    }

    async newBlock(ctx, block, next, reject) {
        ctx.getState = this.getState;
        ctx.dispatch = this.dispatch;
        this._addCache(ctx);
        if(!ctx.recovering) {
            this.cachedState = {};
        }
        return next();
    }

    _addCache(ctx) {
        ctx.cache = {
            get: k => {
                return this.cachedState[k];
            },

            reduce: async (path, fn) => {
                let p = this.cachedState[path];
                if(p) {
                    if(Array.isArray(p)) {
                        p = [
                            ...p
                        ];
                    } else if(typeof p === 'object') {
                        p = {
                            ...p
                        }
                    }
                }
                
                let newState = await fn(p);
                this.cachedState = {
                    ...this.cachedState,
                    [path]: newState
                }
            }
        }
    }
}