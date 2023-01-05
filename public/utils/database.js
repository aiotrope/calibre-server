"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _config = require("./config.js");
var _mongoose = _interopRequireDefault(require("mongoose"));
var _consola = _interopRequireDefault(require("consola"));
var ConnectDB = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var env, dbURL, opts, conn;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _mongoose.default.set('strictQuery', false);
          env = process.env.NODE_ENV || 'development';
          dbURL = _config.environment[env].dbString;
          opts = {
            autoIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
          };
          _context.prev = 4;
          _context.next = 7;
          return _mongoose.default.connect(dbURL, opts);
        case 7:
          conn = _context.sent;
          _consola.default.info("MongoDB Connected: ".concat(conn.connection.host));
          _context.next = 15;
          break;
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          _consola.default.error("connection error: ".concat(_context.t0));
          process.exit(1);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 11]]);
  }));
  return function ConnectDB() {
    return _ref.apply(this, arguments);
  };
}();
var _default = ConnectDB;
exports.default = _default;