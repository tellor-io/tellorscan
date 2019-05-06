import Web3 from 'web3';
import {
  DEFAULT_MASTER_CONTRACT
} from 'Constants/chain/web3Config';
import abi from 'Chain/abi';
import Web3Contract from './Web3Contract';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {Creators as ChainCreators} from 'Redux/chain/actions';

//the maximum numbre of blocks we care about. Be careful what to set this
//to as it impacts how long startup will take when no local storage or
//event data exists. 8K is generally the number of mainnet blocks per day.
const MAX_BLOCKS = 8000;

export default class Web3Wrapper {
  constructor(props) {
    this.times = {};

    [
      'init',
      'unload',
      'getBlock',
      'latestBlock',
      'getContract',
      'getTime',
      'getMissingBlockRanges',
      'checkInDispute',
      '_storeBlockTime',
      'fillBlockGap'
    ].forEach(fn=>{
      if(!this[fn]) { throw new Error("Web3Wrapper missing fn: " + fn)}
      this[fn]=this[fn].bind(this);
    });
  }

  init() {
    return async (dispatch, getState) => {
      console.log("Chain init called");

      //if we've already been initialized, just ask contract to re-initialize
      if(this.contract) {
        await this.contract.init();
        return;
      }

      //set up web3
      let ethProvider = window.ethereum;
      if(!ethProvider && window.web3){
        ethProvider =  window.web.currentProvider;
      }
      if(ethProvider) {

        this.web3 = new Web3(ethProvider);
        let acts = await ethProvider.enable();
        if(!acts) {
          //user denied access to app
          acts = [];
        }

        //If the user changes account in metamask
        ethProvider.on('accountsChanged', async (accounts) => {
          //grab new account and assign as contract default caller address
          this.ethereumAccount = accounts[0];
          this.contract.caller = accounts[0];
          console.log("Accounts changed in MM");

          //check whether the address is currently in dispute
          await this.checkInDispute();

          //re-establish the chain with new account
          dispatch(ChainCreators.loadSuccess(this));
        });

        this.network = await this.web3.eth.net.getNetworkType();

        //establish the latest block number
        this.block = await this.web3.eth.getBlockNumber();
        console.log("Latest block", this.block);


        //create eth contract with default address defined in
        //Constants/chain/web3Config
        let master = new this.web3.eth.Contract(abi, DEFAULT_MASTER_CONTRACT, {
          address: DEFAULT_MASTER_CONTRACT
        });

        //our contract wrapper
        this.contract = new Web3Contract({chain: this, master, caller: acts[0]});

        //the default account selected in metamask
        this.ethereumAccount = acts[0];

        //initialize contract
        await this.contract.init();

        //see if selected account is in dispute
        await this.checkInDispute();
      }
    }
  }

  //call on chain to determine if the current account is in dispute
  async checkInDispute() {
    try {
      let r = await this.contract.isInDispute(this.ethereumAccount);
      this.isInDispute = r;
    } catch (e) {
      console.log("Unsure if in dispute due to call error", e);
    }
  }

  async unload() {
    console.log("Getting unload");
    localStorage.setItem("web3Wrapper.unload", true);
    await this.contract.unload();
  }

  /**
   * Get the timestamp of a particular block number
   */
  async getTime(block) {

    let t = this.times[block];
    if(t) {
      return t;
    }
    let b = await this.web3.eth.getBlock(block);
    if(b) {
      this.times[b.number] = b.timestamp;
      await this._storeBlockTime(b);
      return b.timestamp;
    }
    return undefined;
  }

  /**
   * Get a specific block from chain
   */
  getBlock(number) {
    console.log("Calling getBlock");
    return this.web3.getBlock(number);
  }

  /**
   * Get the latest block for the chain
   */
  async latestBlock() {
    return this.block;
  }

  /**
   * Get the contract wrapper associated with this chain impl
   */
  getContract(props) {
    return this.contract;
  }

  /**
   * Get any gaps in block numbers that need to be restored
   */
  async getMissingBlockRanges(limit) {

    //read all block metadata stored locally
    let all = await Storage.instance.readAll({
      database: dbNames.Blocks,
      limit: limit || MAX_BLOCKS, //about a day
      sort: [
        {
          field: "blockNumber",
          order: "desc"
        }
      ]
    });
    let gaps = [];

    //the last locally-known block
    let last = all[0]?all[0].blockNumber-0:0;

    //the first gap could be from the latest block back
    //NOTE: we can't go back to zero as this would scan forever
    //on test or mainnet. Instead, we limit scans to MAX_BLOCKS
    if(last < this.block) {
      let diff = this.block - last;
      if(diff > MAX_BLOCKS) {
        last = this.block - MAX_BLOCKS;
      }
      gaps.push({
        start: last,
        end: this.block
      });
    }

    all.forEach(a=>{
      //if current block is earlier than one less than last
      //there is a gap
      if(a.blockNumber-0 < (last-1)) {
        let diff = last - (a.blockNumber-0);
        if(diff < MAX_BLOCKS) {
          gaps.push({
            //gap starts with the current block
            start: a.blockNumber-0,
            //going forward in ascending order to last one seen
            end: last
          });
        }
      }
      last = a.blockNumber-0;
    });

    //we need to reverse sort the gaps because they are currently
    //in descending order. They need to be in increasing order so
    //that replay order is preserved at startup. Otherwise, the latest
    //state would be overwritten by early state!
    gaps.sort((a,b)=>{
      return a.start - b.start;
    })
    console.log("Recovering gaps", gaps);
    return gaps;
  }

  /**
   * Record that the given gap has been satisfied
   */
  async fillBlockGap(gap) {
    console.log("Filling block gap", gap);
    for(let i=gap.start;i<=gap.end;++i) {
      let t = this.times[i];
      if(!t) {
        let b = await this.web3.eth.getBlock(i);
        if(b) {
          this.times[i] = b.timestamp;
          await this._storeBlockTime(b);
        }
      }
    }
  }

  /**
   * Store that  block has been received
   */
  async _storeBlockTime(block) {
    if(!block) {
      return;
    }
    await Storage.instance.create({
      database: dbNames.Blocks,
      key: ""+block.number,
      data: {
        blockNumber: block.number,
        timestamp: block.timestamp
      }
    });
  }
}
