"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Largely borrowed from Truffle's HD wallet impl

var bip39 = require("bip39");
var ethJSWallet = require("ethereumjs-wallet");
var hdkey = require("ethereumjs-wallet/hdkey");
var Transaction = require("ethereumjs-tx");
var ethUtils = require('ethereumjs-util');
var starting_wallet_hdpath = "m/44'/60'/0'/0/";

// private helper to normalize given mnemonic
var normalizePrivateKeys = function normalizePrivateKeys(mnemonic) {
  if (Array.isArray(mnemonic)) return mnemonic;else if (mnemonic && !mnemonic.includes(" ")) return [mnemonic];
  // if truthy, but no spaces in mnemonic
  else return false; // neither an array nor valid value passed;
};

// private helper to check if given mnemonic uses BIP39 passphrase protection
var checkBIP39Mnemonic = function checkBIP39Mnemonic(mnemonic, address_index, num_addresses) {
  var seed = bip39.mnemonicToSeedSync(mnemonic);
  var hdwallet = hdkey.fromMasterSeed(seed);
  /*if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Mnemonic invalid or undefined");
  }*/

  var addresses = [];
  var wallets = [];
  // crank the addresses out
  for (var i = address_index; i < address_index + num_addresses; i++) {
    var wallet = hdwallet.derivePath(starting_wallet_hdpath + i).getWallet();
    var addr = "0x" + wallet.getAddress().toString("hex");
    addresses.push(addr);
    wallets[addr] = wallet;
  }

  return {
    addresses: addresses,
    wallets: wallets,
    hdwallet: hdwallet
  };
};

// private helper leveraging ethUtils to populate wallets/addresses
var ethUtilValidation = function ethUtilValidation(privateKeys) {
  // crank the addresses out
  var addresses = [];
  var wallets = [];
  for (var i = address_index; i < address_index + num_addresses; i++) {
    var privateKey = Buffer.from(privateKeys[i].replace("0x", ""), "hex");
    if (ethUtils.isValidPrivate(privateKey)) {
      var wallet = ethJSWallet.fromPrivateKey(privateKey);
      var address = wallet.getAddressString();
      addresses.push(address);
      wallets[address] = wallet;
    }
  }
  return {
    addresses: addresses,
    wallets: wallets
  };
};

var HDWallet = function () {
  function HDWallet(_ref) {
    var _this = this;

    var mnemonic = _ref.mnemonic,
        num_addresses = _ref.num_addresses,
        address_index = _ref.address_index,
        shareNonce = _ref.shareNonce;

    _classCallCheck(this, HDWallet);

    if (!num_addresses) {
      num_addresses = 10;
    }
    if (!address_index) {
      address_index = 0;
    }
    if (typeof shareNonce === 'undefined') {
      shareNonce = true;
    }

    this.numberAddresses = num_addresses;
    this.addressIndex = address_index;
    this.shareNonce = shareNonce;
    this.mnemonic = mnemonic;

    ['init'].forEach(function (fn) {
      return _this[fn] = _this[fn].bind(_this);
    });
  }

  _createClass(HDWallet, [{
    key: "init",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var privateKeys, _ref3, addresses, wallets, hdwallet, _ethUtilValidation, _addresses, _wallets, tmp_accounts, tmp_wallets;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                privateKeys = normalizePrivateKeys(this.mnemonic);

                if (privateKeys) {
                  _context.next = 13;
                  break;
                }

                _context.next = 4;
                return checkBIP39Mnemonic(this.mnemonic, this.addressIndex, this.numberAddresses);

              case 4:
                _ref3 = _context.sent;
                addresses = _ref3.addresses;
                wallets = _ref3.wallets;
                hdwallet = _ref3.hdwallet;

                this.addresses = addresses;
                this.wallets = wallets;
                this.hdwallet = hdwallet;
                _context.next = 16;
                break;

              case 13:
                _ethUtilValidation = ethUtilValidation(privateKeys), _addresses = _ethUtilValidation.addresses, _wallets = _ethUtilValidation.wallets;

                this.addresses = _addresses;
                this.wallets = _wallets;

              case 16:
                tmp_accounts = this.addresses;
                tmp_wallets = this.wallets;


                this.getPrivateKey = function (address, cb) {
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
                this.addresses.forEach(function (a) {
                  return _this2.getPrivateKey(a, function (e, k) {
                    return console.log(k);
                  });
                });
                console.log("]");
                console.groupEnd();

                this.signTransaction = function (txParams, cb) {
                  var pkey = void 0;
                  var from = txParams.from.toLowerCase();
                  if (tmp_wallets[from]) {
                    pkey = tmp_wallets[from].getPrivateKey();
                  } else {
                    cb("Account not found");
                  }
                  var tx = new Transaction(txParams);
                  tx.sign(pkey);
                  var rawTx = "0x" + tx.serialize().toString("hex");
                  cb(null, rawTx);
                };

                this.signMessage = function (_ref4, cb) {
                  var data = _ref4.data,
                      from = _ref4.from;

                  var dataIfExists = data;
                  if (!dataIfExists) {
                    cb("No data to sign");
                  }
                  if (!tmp_wallets[from]) {
                    cb("Account not found");
                  }
                  var pkey = tmp_wallets[from].getPrivateKey();
                  var dataBuff = ethUtil.toBuffer(dataIfExists);
                  var msgHashBuff = ethUtil.hashPersonalMessage(dataBuff);
                  var sig = ethUtil.ecsign(msgHashBuff, pkey);
                  var rpcSig = ethUtil.toRpcSig(sig.v, sig.r, sig.s);
                  cb(null, rpcSig);
                };

                this.signPersonalMessage = function () {
                  _this2.signMessage.apply(_this2, arguments);
                };

              case 30:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref2.apply(this, arguments);
      }

      return init;
    }()
  }]);

  return HDWallet;
}();

exports.default = HDWallet;
//# sourceMappingURL=HDWallet.js.map