"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _server = require("@apollo/server");
var _express = require("@apollo/server/express4");
var _drainHttpServer = require("@apollo/server/plugin/drainHttpServer");
var _express2 = _interopRequireDefault(require("express"));
var _http = _interopRequireDefault(require("http"));
var _database = _interopRequireDefault(require("./utils/database.js"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _typeDefs = require("./schema/typeDefs.js");
var _resolvers = require("./schema/resolvers.js");
var _consola = _interopRequireDefault(require("consola"));
var _config = require("./utils/config.js");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _user = _interopRequireDefault(require("./models/user.js"));
//import { ApolloServerErrorCode } from '@apollo/server/errors'

//import bodyParser from 'body-parser'

var app = (0, _express2.default)();
var httpServer = _http.default.createServer(app);
var server = new _server.ApolloServer({
  typeDefs: _typeDefs.typeDefs,
  resolvers: _resolvers.resolvers,
  plugins: [(0, _drainHttpServer.ApolloServerPluginDrainHttpServer)({
    httpServer: httpServer
  })]
});
var start = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    return _regenerator.default.wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return server.start();
        case 2:
          app.use('/api', (0, _cors.default)(), (0, _helmet.default)({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
          }), _express2.default.urlencoded({
            extended: false
          }), _express2.default.json(), (0, _express.expressMiddleware)(server, {
            context: function () {
              var _context = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref2) {
                var req, auth, decodedToken, authUser;
                return _regenerator.default.wrap(function _callee$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      req = _ref2.req;
                      auth = req ? req.headers.authorization : null;
                      if (!(auth && auth.toLowerCase().startsWith('bearer'))) {
                        _context2.next = 8;
                        break;
                      }
                      decodedToken = _jsonwebtoken.default.verify(auth.substring(7), _config.jwt_key);
                      _context2.next = 6;
                      return _user.default.findById(decodedToken.id);
                    case 6:
                      authUser = _context2.sent;
                      return _context2.abrupt("return", {
                        authUser: authUser
                      });
                    case 8:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee);
              }));
              function context(_x) {
                return _context.apply(this, arguments);
              }
              return context;
            }()
          }));
          (0, _database.default)().then(function () {
            httpServer.listen(_config.port, function () {
              _consola.default.info("\uD83D\uDE80 Server ready at http://localhost:".concat(_config.port, "/"));
            });
          });
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee2);
  }));
  return function start() {
    return _ref.apply(this, arguments);
  };
}();
start();
var _default = httpServer;
exports.default = _default;