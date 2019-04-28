'use strict';

require('babel-polyfill');

var _ChainWrapper = require('./ChainWrapper');

var _ChainWrapper2 = _interopRequireDefault(_ChainWrapper);

var _TaskHandler = require('./TaskHandler');

var _TaskHandler2 = _interopRequireDefault(_TaskHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var main = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', new Promise(function (done, err) {
              var chain = new _ChainWrapper2.default({
                mnemonic: "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
                masterAddress: "0x2B63d6e98E66C7e9fe11225Ba349B0B33234D9A2"
              });

              chain.init().then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var task;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        task = new _TaskHandler2.default({
                          chain: chain
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

          case 1:
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