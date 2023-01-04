"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _server = require("@apollo/server");
var _express = require("@apollo/server/express4");
var _drainHttpServer = require("@apollo/server/plugin/drainHttpServer");
var _schema = require("@graphql-tools/schema");
var _ws = require("ws");
var _ws2 = require("graphql-ws/lib/use/ws");
var _express2 = _interopRequireDefault(require("express"));
var _http = _interopRequireDefault(require("http"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _user = _interopRequireDefault(require("./models/user.js"));
var _consola = _interopRequireDefault(require("consola"));
var _config = require("./utils/config.js");
var _typeDefs = require("./schema/typeDefs.js");
var _resolvers = require("./schema/resolvers.js");
var _database = _interopRequireDefault(require("./utils/database.js"));
var start = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
    var app, httpServer, schema, wsServer, serverCleanup, server;
    return _regenerator.default.wrap(function _callee4$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          app = (0, _express2.default)();
          httpServer = _http.default.createServer(app);
          schema = (0, _schema.makeExecutableSchema)({
            typeDefs: _typeDefs.typeDefs,
            resolvers: _resolvers.resolvers
          });
          wsServer = new _ws.WebSocketServer({
            server: httpServer,
            path: '/api'
          });
          serverCleanup = (0, _ws2.useServer)({
            schema: schema
          }, wsServer);
          server = new _server.ApolloServer({
            schema: schema,
            plugins: [(0, _drainHttpServer.ApolloServerPluginDrainHttpServer)({
              httpServer: httpServer
            }), {
              serverWillStart: function serverWillStart() {
                return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
                  return _regenerator.default.wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        return _context2.abrupt("return", {
                          drainServer: function drainServer() {
                            return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
                              return _regenerator.default.wrap(function _callee$(_context) {
                                while (1) switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return serverCleanup.dispose();
                                  case 2:
                                  case "end":
                                    return _context.stop();
                                }
                              }, _callee);
                            }))();
                          }
                        });
                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2);
                }))();
              }
            }]
          });
          _context5.next = 8;
          return server.start();
        case 8:
          app.use('/api', (0, _cors.default)(), (0, _helmet.default)({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
          }), _bodyParser.default.json(), (0, _express.expressMiddleware)(server, {
            context: function () {
              var _context3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(_ref2) {
                var req, authHeader, token, decoded, authUser;
                return _regenerator.default.wrap(function _callee3$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      req = _ref2.req;
                      authHeader = req.headers['authorization'];
                      token = authHeader && authHeader.split(' ')[1];
                      if (!token) {
                        _context4.next = 9;
                        break;
                      }
                      decoded = _jsonwebtoken.default.verify(token, _config.jwt_key);
                      _context4.next = 7;
                      return _user.default.findById(decoded.id);
                    case 7:
                      authUser = _context4.sent;
                      return _context4.abrupt("return", {
                        authUser: authUser
                      });
                    case 9:
                    case "end":
                      return _context4.stop();
                  }
                }, _callee3);
              }));
              function context(_x) {
                return _context3.apply(this, arguments);
              }
              return context;
            }()
          }));
          (0, _database.default)().then(function () {
            httpServer.listen(_config.port, function () {
              _consola.default.info("\uD83D\uDE80 Server ready at http://localhost:".concat(_config.port, "/"));
            });
          });
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee4);
  }));
  return function start() {
    return _ref.apply(this, arguments);
  };
}();
start();