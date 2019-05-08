'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EMPTY_VARS = {
  _challenge: null,
  _requestId: 0,
  _difficult: 0,
  _queryString: null
};

var ContractWrapper = function () {
  function ContractWrapper(props) {
    var _this = this;

    _classCallCheck(this, ContractWrapper);

    this.master = props.master;
    this.masterAddress = props.masterAddress;
    this.chain = props.chain;
    this.wallet = props.wallet;

    ['init', 'unload', 'requestData', 'addTip', 'getCurrentVariables', 'getStakerInfo', 'submitMiningSolution', 'tellorPostConstructor', '_call', '_send'].forEach(function (fn) {
      if (!_this[fn]) {
        throw new Error("Web3Contract missing fn: " + fn);
      }
      _this[fn] = _this[fn].bind(_this);
    });
  }

  _createClass(ContractWrapper, [{
    key: 'init',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'unload',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function unload() {
        return _ref2.apply(this, arguments);
      }

      return unload;
    }()
  }, {
    key: 'getCurrentVariables',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(caller) {
        var vars;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._call(caller, this.master, "getCurrentVariables", []);

              case 2:
                vars = _context3.sent;

                if (!(!vars || vars[1].toString() - 0 === 0)) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt('return', EMPTY_VARS);

              case 5:
                return _context3.abrupt('return', {
                  _challenge: vars[0],
                  _requestId: vars[1].toString() - 0,
                  _difficulty: vars[2].toString() - 0,
                  _queryString: vars[3],
                  _granularity: vars[4].toString() - 0,
                  _totalTip: vars[5].toString() - 0
                });

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getCurrentVariables(_x) {
        return _ref3.apply(this, arguments);
      }

      return getCurrentVariables;
    }()
  }, {
    key: 'getStakerInfo',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(address) {
        var vars;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._call(address, this.master, "getStakerInfo", [address]);

              case 2:
                vars = _context4.sent;
                return _context4.abrupt('return', {
                  status: vars[0].toString() - 0
                });

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getStakerInfo(_x2) {
        return _ref4.apply(this, arguments);
      }

      return getStakerInfo;
    }()
  }, {
    key: 'tellorPostConstructor',
    value: function tellorPostConstructor(caller) {
      return this._send(caller, this.master, "tellorPostConstructor", []);
    }
  }, {
    key: 'requestData',
    value: function requestData(caller, queryString, symbol, multiplier, tip) {
      return this._send(caller, this.master, "requestData", [queryString, symbol, multiplier, tip]);
    }
  }, {
    key: 'addTip',
    value: function addTip(caller, requestId, tip) {
      return this._send(caller, this.master, "addTip", [requestId, tip]);
    }
  }, {
    key: 'submitMiningSolution',
    value: function submitMiningSolution(caller, _nonce, _requestId, _value) {
      return this._send(caller, this.master, "submitMiningSolution", [_nonce, _requestId, _value]);
    }
  }, {
    key: '_call',
    value: function _call(caller, con, method, args) {
      var _con$methods;

      return (_con$methods = con.methods)[method].apply(_con$methods, _toConsumableArray(args)).call({
        from: caller,
        gas: 100000
      });
    }
  }, {
    key: '_send',
    value: function _send(caller, con, method, args) {
      var _this2 = this;

      var web3 = this.chain.web3;

      return new Promise(function (done, err) {
        web3.eth.getTransactionCount(caller, function (e, nonce) {
          var _con$methods2;

          if (e) {
            err(e);
            return;
          }

          var txn = (_con$methods2 = con.methods)[method].apply(_con$methods2, _toConsumableArray(args));
          var data = txn.encodeABI();
          var web3 = _this2.chain.web3;

          var txParams = {
            nonce: nonce,
            gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
            gasLimit: 2000000,
            to: _this2.masterAddress,
            from: caller,
            value: 0,
            data: data
          };
          _this2.wallet.signTransaction(txParams, function (e, raw) {
            if (raw) {
              console.log("Sending signed txn...", txParams);
              try {
                web3.eth.sendSignedTransaction(raw).on('transactionHash', function (txHash) {
                  console.log("Txn hash", txHash);
                  done(txHash);
                }).on('receipt', function (receipt) {
                  console.log("Txn receipt", receipt);
                }).on('error', function (e) {
                  console.log("Txn error", e);
                  err(e);
                }).catch(function (e) {
                  console.log("Txn error", e);
                  err(e);
                });
              } catch (e) {
                console.log("Problem with sending txn", e);
                err(e);
              }
            } else if (e) {
              console.log("Problem submitting nonce", e);
              err(e);
            }
          });
        });
      });
    }
  }]);

  return ContractWrapper;
}();

exports.default = ContractWrapper;
//# sourceMappingURL=ContractWrapper.js.map