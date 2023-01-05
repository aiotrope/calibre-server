"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
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
var path = _interopRequireWildcard(require("path"));
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
var _index = _interopRequireDefault(require("./routes/index.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
(0, _database.default)();
var start = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
    var app, httpServer, schema, wsServer, serverCleanup, server;
    return _regenerator.default.wrap(function _callee4$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          app = (0, _express2.default)(); // view engine setup
          app.set('views', path.join(__dirname, 'views'));
          app.set('view engine', 'ejs');
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
          _context5.next = 10;
          return server.start();
        case 10:
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
                      return _user.default.findById(decoded.id).populate('repositories');
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
          app.use('/', _express2.default.static(path.join(__dirname, 'public')), (0, _cors.default)(), _express2.default.json(), (0, _helmet.default)({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
          }), _index.default);
          httpServer.listen(_config.port, function () {
            _consola.default.info("\uD83D\uDE80 Server ready at http://localhost:".concat(_config.port, "/"));
          });
        case 13:
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