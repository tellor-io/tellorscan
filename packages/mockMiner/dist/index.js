'use strict';

require('babel-polyfill');

var _ChainWrapper = require('./ChainWrapper');

var _ChainWrapper2 = _interopRequireDefault(_ChainWrapper);

var _TaskHandler = require('./TaskHandler');

var _TaskHandler2 = _interopRequireDefault(_TaskHandler);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var DEFAULT_MINE_SLEEP = 65000;

var main = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var addr, web3Url, sleepTime, provider, initRequired;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            addr = process.env.CONTRACT_ADDRESS;

            if (addr) {
              _context2.next = 3;
              break;
            }

            throw new Error("Missing CONTRACT_ADDRESS environment var");

          case 3:
            web3Url = process.env.WEB3_URL;

            if (web3Url) {
              _context2.next = 6;
              break;
            }

            throw new Error("Missing WEB3_URL environment var");

          case 6:
            if (web3Url.startsWith("ws")) {
              _context2.next = 8;
              break;
            }

            throw new Error("Only support websocket based web3 url: " + web3Url);

          case 8:
            sleepTime = process.env.MINE_SLEEP_CYCLE || DEFAULT_MINE_SLEEP;

            sleepTime -= 0;

            console.log("Using web3 provider", web3Url);
            provider = new _web2.default.providers.WebsocketProvider(web3Url);
            initRequired = process.env.INIT_REQUIRED;

            if (initRequired && initRequired.trim().length === 0) {
              initRequired = undefined;
            }

            return _context2.abrupt('return', new Promise(function (done, err) {
              var chain = new _ChainWrapper2.default({
                mnemonic: "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
                masterAddress: addr,
                provider: provider
              });

              chain.init().then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var task;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        task = new _TaskHandler2.default({
                          chain: chain,
                          initRequired: initRequired,
                          miningSleepTime: sleepTime
                        });
                        _context.next = 3;
                        return task.start();

                      case 3:
                        done();

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              })));
            }));

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

console.log("Starting mock miner...");
main().then(function () {
  console.log("Done");
});
//# sourceMappingURL=index.js.map