'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Miner = require('./Miner');

var _Miner2 = _interopRequireDefault(_Miner);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NUM_MINERS = 6;
var SLEEP_BETWEEN_CHECKS = 5000;
var SLEEP_BETWEEN_MINES = 10000; //65000;

var MINER_ADDRESSES = ["0xe010aC6e0248790e08F42d5F697160DEDf97E024", "0xE037EC8EC9ec423826750853899394dE7F024fee", "0xcdd8FA31AF8475574B8909F135d510579a8087d3", "0xb9dD5AfD86547Df817DA2d0Fb89334A6F8eDd891", "0x230570cD052f40E14C14a81038c6f3aa685d712B", "0x3233afA02644CCd048587F8ba6e99b3C00A34DcC"];

var sleep = function sleep(time) {
  return new Promise(function (done) {
    setTimeout(function () {
      return done();
    }, time);
  });
};

var TaskHandler = function () {
  function TaskHandler(props) {
    var _this = this;

    _classCallCheck(this, TaskHandler);

    this.chain = props.chain;
    this.miners = [];
    for (var i = 0; i < NUM_MINERS; ++i) {
      var m = new _Miner2.default({
        chain: this.chain,
        account: MINER_ADDRESSES[i]
      });
      this.miners.push(m);
    }
    ['start', 'stop', '_runMiningCycle', '_submitNonce', '_getValue'].forEach(function (fn) {
      return _this[fn] = _this[fn].bind(_this);
    });
  }

  _createClass(TaskHandler, [{
    key: 'start',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var next;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log("Mining tasker starting up");
                this.running = true;

              case 2:
                if (!this.running) {
                  _context.next = 19;
                  break;
                }

                _context.next = 5;
                return this.chain.contract.getCurrentVariables();

              case 5:
                next = _context.sent;

                console.log("New challenge to be mined: ", next);

                if (!next._challenge) {
                  _context.next = 15;
                  break;
                }

                _context.next = 10;
                return this._runMiningCycle(next);

              case 10:
                console.log("Waiting for next mining cycle...");
                _context.next = 13;
                return sleep(SLEEP_BETWEEN_MINES);

              case 13:
                _context.next = 17;
                break;

              case 15:
                _context.next = 17;
                return sleep(SLEEP_BETWEEN_CHECKS);

              case 17:
                _context.next = 2;
                break;

              case 19:
                console.log("Mining tasker shutting down");

              case 20:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _ref.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'stop',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.running = false;

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function stop() {
        return _ref2.apply(this, arguments);
      }

      return stop;
    }()
  }, {
    key: '_runMiningCycle',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(next) {
        var all, canMine, i, m, stat, nonces, _i, n, value;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                all = [];
                canMine = [];
                i = 0;

              case 3:
                if (!(i < this.miners.length)) {
                  _context3.next = 13;
                  break;
                }

                m = this.miners[i];
                _context3.next = 7;
                return this.chain.contract.getStakerInfo(m.account);

              case 7:
                stat = _context3.sent;

                console.log("Address, Status", m.account, stat);
                if (stat.status === 1 && canMine.length < 5) {
                  canMine.push(m);
                }

              case 10:
                ++i;
                _context3.next = 3;
                break;

              case 13:
                if (!(canMine.length < 5)) {
                  _context3.next = 16;
                  break;
                }

                console.log("Don't have enough mock miners to run mining cycle!");
                return _context3.abrupt('return');

              case 16:

                canMine.forEach(function (m) {
                  all.push(m.mine({
                    challenge: next._challenge,
                    queryString: next._queryString,
                    difficulty: next._difficulty
                  }));
                });
                _context3.next = 19;
                return Promise.all(all);

              case 19:
                nonces = _context3.sent;
                _i = 0;

              case 21:
                if (!(_i < nonces.length)) {
                  _context3.next = 34;
                  break;
                }

                n = nonces[_i];

                if (!(n > 0)) {
                  _context3.next = 31;
                  break;
                }

                _context3.next = 26;
                return this._getValue(next._queryString);

              case 26:
                value = _context3.sent;

                if (isNaN(value)) {
                  _context3.next = 31;
                  break;
                }

                value *= next._granularity;
                _context3.next = 31;
                return this._submitNonce(_extends({}, next, { miner: canMine[_i].account, nonce: n, value: value }));

              case 31:
                ++_i;
                _context3.next = 21;
                break;

              case 34:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _runMiningCycle(_x) {
        return _ref3.apply(this, arguments);
      }

      return _runMiningCycle;
    }()
  }, {
    key: '_getValue',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(queryString) {
        var jsonField, s, r, data;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                jsonField = null;

                if (queryString.startsWith("json")) {
                  jsonField = queryString.substr(queryString.lastIndexOf(".") + 1);
                  s = queryString.substring(queryString.indexOf("(") + 1, queryString.lastIndexOf(")"));

                  queryString = s;
                }
                //console.log("Will query value", queryString, jsonField);
                _context4.next = 4;
                return _axios2.default.get(queryString);

              case 4:
                r = _context4.sent;
                data = r.data;

                if (typeof data === 'string') {
                  data = JSON.parse(data);
                }

                if (!jsonField) {
                  _context4.next = 9;
                  break;
                }

                return _context4.abrupt('return', data[jsonField] - 0);

              case 9:
                return _context4.abrupt('return', data - 0);

              case 10:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _getValue(_x2) {
        return _ref4.apply(this, arguments);
      }

      return _getValue;
    }()
  }, {
    key: '_submitNonce',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(props) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;

                console.log("Submitting solution", props);
                _context5.next = 4;
                return this.chain.contract.submitMiningSolution(props.miner, "" + props.nonce, props._requestId, props.value);

              case 4:
                console.log("Submitted mining solution", props);
                _context5.next = 10;
                break;

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5['catch'](0);

                console.log("Failed to submit mining solution", _context5.t0);

              case 10:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 7]]);
      }));

      function _submitNonce(_x3) {
        return _ref5.apply(this, arguments);
      }

      return _submitNonce;
    }()
  }]);

  return TaskHandler;
}();

exports.default = TaskHandler;
//# sourceMappingURL=TaskHandler.js.map