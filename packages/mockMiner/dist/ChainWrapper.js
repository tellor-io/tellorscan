'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _yup = require('yup');

var yup = _interopRequireWildcard(_yup);

var _abi = require('./abi');

var _abi2 = _interopRequireDefault(_abi);

var _HDWallet = require('./HDWallet');

var _HDWallet2 = _interopRequireDefault(_HDWallet);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _ContractWrapper = require('./ContractWrapper');

var _ContractWrapper2 = _interopRequireDefault(_ContractWrapper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_URL = "localhost:8545";
var propSchema = yup.object().shape({
  masterAddress: yup.string().required("Missing master address"),
  mnemonic: yup.string().required("Missing wallet mnemonic string"),
  provider: yup.object()
});

var ChainWrapper = function () {
  function ChainWrapper(props) {
    var _this = this;

    _classCallCheck(this, ChainWrapper);

    propSchema.validateSync(props);

    this.provider = props.provider;
    this.masterAddress = props.masterAddress;
    this.wallet = new _HDWallet2.default({
      mnemonic: props.mnemonic,
      num_addresses: 10
    });

    ['init', 'getBlockNumber'].forEach(function (fn) {
      return _this[fn] = _this[fn].bind(_this);
    });
  }

  _createClass(ChainWrapper, [{
    key: 'init',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var master;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;


                this.web3 = new _web2.default(this.provider || "ws://" + DEFAULT_URL, _net2.default);
                _context.next = 4;
                return this.wallet.init();

              case 4:
                master = new this.web3.eth.Contract(_abi2.default, this.masterAddress, { address: this.masterAddress });

                this.contract = new _ContractWrapper2.default({ chain: this, master: master, masterAddress: this.masterAddress, wallet: this.wallet });
                _context.next = 12;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](0);

                console.log("Problem creating Web3", _context.t0);
                throw _context.t0;

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
      }));

      function init() {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'getBlockNumber',
    value: function getBlockNumber() {
      return this.web3.eth.getBlockNumber();
    }
  }]);

  return ChainWrapper;
}();

exports.default = ChainWrapper;
//# sourceMappingURL=ChainWrapper.js.map