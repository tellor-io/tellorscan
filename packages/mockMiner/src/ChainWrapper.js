import Web3 from 'web3';
import * as yup from 'yup';
import abi from './abi';
import HDWallet from './HDWallet';
import net from 'net';
import ContractWrapper from './ContractWrapper';

const DEFAULT_URL = "localhost:8545";
const propSchema = yup.object().shape({
  masterAddress: yup.string().required("Missing master address"),
  mnemonic: yup.string().required("Missing wallet mnemonic string"),
  provider: yup.object()
});

export default class ChainWrapper {

  constructor(props) {
    propSchema.validateSync(props);

    this.provider = props.provider;
    this.masterAddress = props.masterAddress;
    this.initRequired = props.initRequired;

    this.wallet = new HDWallet({
      mnemonic: props.mnemonic,
      num_addresses: 10
    });

    [
      'init',
      'getBlockNumber'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }


  async init() {
    try {

      this.web3 = new Web3(this.provider || "ws://" + DEFAULT_URL, net);
      await this.wallet.init();
      let master = new this.web3.eth.Contract(abi, this.masterAddress, {address: this.masterAddress});
      this.contract = new ContractWrapper({chain: this, master, masterAddress: this.masterAddress, wallet: this.wallet});
      
    } catch (e) {
      console.log("Problem creating Web3", e);
      throw e;
    }
  }

  getBlockNumber() {
    return this.web3.eth.getBlockNumber();
  }
}
