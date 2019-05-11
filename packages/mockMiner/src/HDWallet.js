
//Largely borrowed from Truffle's HD wallet impl

const bip39 = require("bip39");
const ethJSWallet = require("ethereumjs-wallet");
const hdkey = require("ethereumjs-wallet/hdkey");
const Transaction = require("ethereumjs-tx");
const ethUtils = require('ethereumjs-util');
const starting_wallet_hdpath = "m/44'/60'/0'/0/";


// private helper to normalize given mnemonic
const normalizePrivateKeys = mnemonic => {
  if (Array.isArray(mnemonic)) return mnemonic;
  else if (mnemonic && !mnemonic.includes(" ")) return [mnemonic];
  // if truthy, but no spaces in mnemonic
  else return false; // neither an array nor valid value passed;
};

// private helper to check if given mnemonic uses BIP39 passphrase protection
const checkBIP39Mnemonic = (mnemonic, address_index, num_addresses) => {
  let seed = bip39.mnemonicToSeedSync(mnemonic);
  let hdwallet = hdkey.fromMasterSeed(seed);
  /*if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Mnemonic invalid or undefined");
  }*/

  let addresses = [];
  let wallets = [];
  // crank the addresses out
  for (let i = address_index; i < address_index + num_addresses; i++) {
    const wallet = hdwallet
      .derivePath(starting_wallet_hdpath + i)
      .getWallet();
    const addr = `0x${wallet.getAddress().toString("hex")}`;
    addresses.push(addr);
    wallets[addr] = wallet;
  }

  return {
    addresses,
    wallets,
    hdwallet
  }
};

// private helper leveraging ethUtils to populate wallets/addresses
const ethUtilValidation = privateKeys => {
  // crank the addresses out
  let addresses = [];
  let wallets = [];
  for (let i = address_index; i < address_index + num_addresses; i++) {
    const privateKey = Buffer.from(privateKeys[i].replace("0x", ""), "hex");
    if (ethUtils.isValidPrivate(privateKey)) {
      const wallet = ethJSWallet.fromPrivateKey(privateKey);
      const address = wallet.getAddressString();
      addresses.push(address);
      wallets[address] = wallet;
    }
  }
  return {
    addresses,
    wallets
  }
};


export default class HDWallet {
  constructor({
    mnemonic,
    num_addresses,
    address_index,
    shareNonce
  }) {

    if(!num_addresses) {
      num_addresses = 10;
    }
    if(!address_index) {
      address_index = 0;
    }
    if(typeof shareNonce === 'undefined') {
      shareNonce = true;
    }

    this.numberAddresses = num_addresses;
    this.addressIndex = address_index;
    this.shareNonce = shareNonce;
    this.mnemonic = mnemonic;

    [
      'init'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async init() {
    const privateKeys = normalizePrivateKeys(this.mnemonic);

    if (!privateKeys) {
      let {addresses,wallets, hdwallet} = await checkBIP39Mnemonic(this.mnemonic, this.addressIndex, this.numberAddresses);
      this.addresses = addresses;
      this.wallets = wallets;
      this.hdwallet = hdwallet;
    } else {
      let {addresses, wallets} = ethUtilValidation(privateKeys);
      this.addresses = addresses;
      this.wallets = wallets;
    }

    const tmp_accounts = this.addresses;
    const tmp_wallets = this.wallets;

    this.getPrivateKey = (address, cb) => {
      if (!tmp_wallets[address]) {
        return cb("Account not found");
      } else {
        cb(null, tmp_wallets[address].getPrivateKey().toString("hex"));
      }
    };

    console.group("Addresses");
    console.log(this.addresses);
    console.groupEnd();
    console.group("Private Keys");
    console.log("[");
    this.addresses.forEach(a=>this.getPrivateKey(a, (e,k)=>console.log(k)));
    console.log("]");
    console.groupEnd();

    this.signTransaction = (txParams, cb) => {
      let pkey;
      const from = txParams.from.toLowerCase();
      if (tmp_wallets[from]) {
        pkey = tmp_wallets[from].getPrivateKey();
      } else {
        return cb("Account not found");
      }
      const tx = new Transaction(txParams);
      tx.sign(pkey);
      const rawTx = `0x${tx.serialize().toString("hex")}`;
      cb(null, rawTx);
    };

    this.signMessage = ({ data, from }, cb) => {
      const dataIfExists = data;
      if (!dataIfExists) {
        cb("No data to sign");
      }
      if (!tmp_wallets[from]) {
        cb("Account not found");
      }
      let pkey = tmp_wallets[from].getPrivateKey();
      const dataBuff = ethUtil.toBuffer(dataIfExists);
      const msgHashBuff = ethUtil.hashPersonalMessage(dataBuff);
      const sig = ethUtil.ecsign(msgHashBuff, pkey);
      const rpcSig = ethUtil.toRpcSig(sig.v, sig.r, sig.s);
      cb(null, rpcSig);
    };

    this.signPersonalMessage = (...args) => {
      this.signMessage(...args);
    };
  }

}
