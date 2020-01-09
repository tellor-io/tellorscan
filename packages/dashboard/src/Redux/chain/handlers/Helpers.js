import {Handler} from 'eth-pipeline';
import {getCurrentChallenge as getChallenge} from 'Chain/utils';
import * as DBNames from 'Storage/DBNames';
import {Logger} from 'buidl-utils';
import {default as reqOps} from 'Redux/newRequests/operations';
import {default as chOps} from 'Redux/challenges/operations';
import {default as dispOps} from 'Redux/disputes/operations';

const log = new Logger({component: "HelpersHandler"});

export default class Helpers extends Handler {
    constructor(props) {
        super({name: "HelpersHandler"});
        [
            'init',
            'newBlock',
            '_setup'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async init(ctx, next) {
        return this._setup(ctx, next);
    }

    async newBlock(ctx, block, next) {
        return this._setup(ctx, next);
    }

    async _setup(ctx, next) {
        ctx.helpers = {
            findRequestById: async id => {
              let reqs = ctx.cache.get(DBNames.DataRequested) || {};
              let req = reqs[id];
              if(req) {
                return req;
              }

              req = await ctx.dispatch(reqOps.findRequestById(id));
              await ctx.cache.reduce(DBNames.DataRequested, (state) => {
               
                return {
                  ...state,
                  [req.id]: req
                }
              });
              return req;
            },

            getCurrentChallenge: () => {
              return ctx.dispatch(getChallenge());
            },

            findOrCreateChallenge: async (reqId, hash) => {
              let current = ctx.cache.get(DBNames.NewChallenge);
              if(current) {
                for(let i=0;i<current.length;++i) {
                  let c = current[i];
                  if(c.id === reqId && c.challengeHash === hash) {
                    return c;
                  }
                }
              }
              
              let ch = await chOps.findChallenge(hash);
              if(!ch) {
                return await chOps.createChallenge(reqId, hash);
              }
              return ch;
            },

            getMiningOrder: async newVal => {
              let con = ctx.getState().chain.contract;
              if(!con) {
                return null;
              }
              newVal = newVal.normalize();
              //call on-chain to get miners by mining time and request id
              let miners = await con.getMinersByRequestIdAndTimestamp(newVal.id, newVal.mineTime);
            
              //make sure miner addresses are lower case for comparisons
              return miners.map(m=>m.toLowerCase());
            },

            findDisputeForVote: async id => {
              return ctx.dispatch(dispOps.findDisputeById(id));
            }
        }

        return next();
    }
}

const normalizeRequest = req => {
    let disp = req.disputes || {};
    let dById = disp.byId || {};
    let dByHash = disp.byHash || {};
  
    return {
      ...req,
      challenges: {
        ...req.challenges
      },
      disputes: {
        byId: {
          ...dById
        },
        byHash: {
          ...dByHash
        }
      },
      tips: [],
      currentTip: req.currentTip || 0
    }
  }