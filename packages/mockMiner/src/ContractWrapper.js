import Web3 from 'web3';

const EMPTY_VARS = {
  _challenge: null,
  _requestId: 0,
  _difficult: 0,
  _queryString: null
}

export default class ContractWrapper {
  constructor(props) {
    this.master = props.master;
    this.masterAddress = props.masterAddress;
    this.chain = props.chain;
    this.wallet = props.wallet;

    [
      'init',
      'unload',
      'requestData',
      'addTip',
      'getCurrentVariables',
      'getStakerInfo',
      'submitMiningSolution',
      '_call',
      '_send'
    ].forEach(fn=>{
      if(!this[fn]) { throw new Error("Web3Contract missing fn: " + fn)}
      this[fn]=this[fn].bind(this);
    });
  }

  async init() {

  }

  async unload() {

  }

  async getCurrentVariables(caller) {
      let vars = await this._call(caller, this.master, "getCurrentVariables", []);
      if(!vars || vars[1].toString()-0 === 0) {
        return EMPTY_VARS;
      }

      return {
        _challenge: vars[0],
        _requestId: vars[1].toString()-0,
        _difficulty: vars[2].toString()-0,
        _queryString: vars[3],
        _granularity: vars[4].toString()-0,
        _totalTip: vars[5].toString()-0
      }
  }

  async getStakerInfo(address) {
    let vars = await this._call(address, this.master, "getStakerInfo", [address]);
    return {
      status: vars[0].toString()-0
    }
  }

  requestData(caller, queryString, symbol, requestId, multiplier, tip) {
    return this._send(caller, this.master, "requestData", [queryString, symbol, requestId, multiplier, tip]);
  }

  addTip(caller, requestId, tip) {
    return this._send(caller, this.master, "addTip", [requestId, tip]);
  }

  submitMiningSolution(caller, _nonce, _requestId, _value) {
    return this._send(caller, this.master, "submitMiningSolution", [_nonce, _requestId, _value]);
  }

  _call(caller, con, method, args) {
    return con.methods[method](...args).call({
      from: caller,
      gas: 100000
    });
  }

  _send(caller, con, method, args) {
    let web3 = this.chain.web3;

    return new Promise((done,err)=>{
      web3.eth.getTransactionCount(caller, (e, nonce) => {
        if(e) {
          err(e);
          return;
        }

        let txn = con.methods[method](...args);
        let data = txn.encodeABI();
        let web3 = this.chain.web3;

        let txParams = {
          nonce: nonce,
          gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
          gasLimit: 2000000,
          to: this.masterAddress,
          from: caller,
          value: 0,
          data: data,
        }
        this.wallet.signTransaction(txParams, (e,raw)=>{
          if(raw) {
            console.log("Sending signed txn...", txParams);
            try {
            	web3.eth.sendSignedTransaction(raw)
                .on('transactionHash',  (txHash) => {
                  console.log("Txn hash", txHash);
                  done(txHash);
              	})
                .on('receipt', (receipt) => {
                  console.log("Txn receipt", receipt);
             		})
                .on('error', (e) => {
                  console.log("Txn error", e);
                  err(e);
            	  }).catch((e)=>{
                  console.log("Txn error", e);
                  err(e);
                });
            } catch (e) {
          		console.log("Problem with sending txn", e);
          		err(e);
            }
          } else if(e) {
            console.log("Problem submitting nonce", e);
            err(e);
          }
        });
      });
    });


    let tx = con.methods[method](...args);
      return new Promise((done,err)=>{
        this.chain.web3.eth.sendTransaction({
            to: con.address,
            from: this.caller,
            data: tx.encodeABI()
          }, (e, r)=>{
            if(e) {
              err(e);
            } else {
              done(r);
            }
          });
      });
  }
}
