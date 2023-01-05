"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _config = require("../utils/config.js");
var _graphql = require("graphql");
var _mongoose = _interopRequireDefault(require("mongoose"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _consola = _interopRequireDefault(require("consola"));
var _user4 = _interopRequireDefault(require("../models/user.js"));
var _repository2 = _interopRequireDefault(require("../models/repository.js"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var resolvers = {
  Query: {
    users: function () {
      var _users = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_, __, contextValue) {
        var authUser, _users2;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              authUser = contextValue.authUser;
              if (authUser) {
                _context.next = 3;
                break;
              }
              throw new _graphql.GraphQLError('User is not authenticated', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401
                  }
                }
              });
            case 3:
              _context.prev = 3;
              _context.next = 6;
              return _user4.default.find({}).populate('repositories');
            case 6:
              _users2 = _context.sent;
              return _context.abrupt("return", _users2);
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](3);
              throw new _graphql.GraphQLError("Can't processed users request: ".concat(_context.t0.message, "!"), {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 10]]);
      }));
      function users(_x, _x2, _x3) {
        return _users.apply(this, arguments);
      }
      return users;
    }(),
    user: function () {
      var _user = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(_, args, contextValue) {
        var authUser, _user2;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              authUser = contextValue.authUser;
              if (authUser) {
                _context2.next = 3;
                break;
              }
              throw new _graphql.GraphQLError('User is not authenticated', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401
                  }
                }
              });
            case 3:
              _context2.prev = 3;
              _context2.next = 6;
              return _user4.default.findById(args.id).populate('repositories');
            case 6:
              _user2 = _context2.sent;
              return _context2.abrupt("return", _user2);
            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](3);
              throw new _graphql.GraphQLError("Can't processed user with ".concat(args.id, ": ").concat(_context2.t0.message), {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[3, 10]]);
      }));
      function user(_x4, _x5, _x6) {
        return _user.apply(this, arguments);
      }
      return user;
    }(),
    repositories: function () {
      var _repositories = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(_, __, contextValue) {
        var authUser, repos;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              authUser = contextValue.authUser;
              if (authUser) {
                _context3.next = 3;
                break;
              }
              throw new _graphql.GraphQLError('User is not authenticated', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401
                  }
                }
              });
            case 3:
              _context3.prev = 3;
              _context3.next = 6;
              return _repository2.default.find({}).populate('user');
            case 6:
              repos = _context3.sent;
              return _context3.abrupt("return", repos);
            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](3);
              throw new _graphql.GraphQLError("Can't processed users request: ".concat(_context3.t0.message, "!"), {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 13:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[3, 10]]);
      }));
      function repositories(_x7, _x8, _x9) {
        return _repositories.apply(this, arguments);
      }
      return repositories;
    }(),
    repository: function () {
      var _repository = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(_, args, contextValue) {
        var authUser, repo;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              authUser = contextValue.authUser;
              if (authUser) {
                _context4.next = 3;
                break;
              }
              throw new _graphql.GraphQLError('User is not authenticated', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401
                  }
                }
              });
            case 3:
              _context4.prev = 3;
              _context4.next = 6;
              return _repository2.default.findById(args.id).populate('user');
            case 6:
              repo = _context4.sent;
              return _context4.abrupt("return", repo);
            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](3);
              throw new _graphql.GraphQLError("Can't processed user with ".concat(args.id, ": ").concat(_context4.t0.message), {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 13:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[3, 10]]);
      }));
      function repository(_x10, _x11, _x12) {
        return _repository.apply(this, arguments);
      }
      return repository;
    }()
  },
  Mutation: {
    signup: function () {
      var _signup = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(parent, args) {
        var duplicateUsername, regexPass, regexUser, testPassword, testUsername, saltRounds, passwordHash, user, newUser, response;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _user4.default.findOne({
                username: args.username
              });
            case 2:
              duplicateUsername = _context5.sent;
              regexPass = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{3,}$/gm;
              regexUser = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{5,}$/gm;
              testPassword = regexPass.test(args.password);
              testUsername = regexUser.test(args.username);
              if (!(args.username.length < 5 && !testUsername)) {
                _context5.next = 11;
                break;
              }
              throw new _graphql.GraphQLError("".concat(args.username, " invalid! Must be at least 5 characters upper/lower case, numbers and special characters are allowed."), {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  argumentName: 'username'
                }
              });
            case 11:
              if (!(args.password.length < 3 && !testPassword)) {
                _context5.next = 15;
                break;
              }
              throw new _graphql.GraphQLError("".concat(args.password, " invalid! Password must be at least 3 characters in length."), {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  argumentName: 'password'
                }
              });
            case 15:
              if (!duplicateUsername) {
                _context5.next = 19;
                break;
              }
              throw new _graphql.GraphQLError("".concat(args.username, " invalid! The username you entered is already been taken."), {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  argumentName: 'username'
                }
              });
            case 19:
              saltRounds = 10;
              _context5.next = 22;
              return _bcrypt.default.hash(args.password, saltRounds);
            case 22:
              passwordHash = _context5.sent;
              user = new _user4.default({
                username: args.username,
                passwordHash: passwordHash
              });
              _context5.prev = 24;
              _context5.next = 27;
              return _user4.default.create(user);
            case 27:
              newUser = _context5.sent;
              if (!newUser) {
                _context5.next = 31;
                break;
              }
              response = {
                id: newUser.id,
                username: newUser.username,
                successSignupMessage: "".concat(newUser.username, " signup successful!")
              };
              return _context5.abrupt("return", response);
            case 31:
              _context5.next = 37;
              break;
            case 33:
              _context5.prev = 33;
              _context5.t0 = _context5["catch"](24);
              _consola.default.error(_context5.t0.message);
              throw new _graphql.GraphQLError("Can't processed createUser request due to some internal issues.", {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 37:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[24, 33]]);
      }));
      function signup(_x13, _x14) {
        return _signup.apply(this, arguments);
      }
      return signup;
    }(),
    login: function () {
      var _login = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(parent, args) {
        var user, passwordVerified, regexPass, regexUser, testPassword, testUsername, userToken, token, decode, userId, loginUsername, msg;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _user4.default.findOne({
                username: args.username
              });
            case 2:
              user = _context6.sent;
              _context6.next = 5;
              return _bcrypt.default.compare(args.password, user.passwordHash);
            case 5:
              passwordVerified = _context6.sent;
              regexPass = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{3,}$/gm;
              regexUser = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{5,}$/gm;
              testPassword = regexPass.test(args.password);
              testUsername = regexUser.test(args.username);
              if (!(args.username.length < 5 || !testUsername)) {
                _context6.next = 14;
                break;
              }
              throw new _graphql.GraphQLError('Invalid! Check if you entered your correct username or password', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  argumentName: 'username'
                }
              });
            case 14:
              if (!(args.password.length < 3 || !testPassword)) {
                _context6.next = 18;
                break;
              }
              throw new _graphql.GraphQLError('Invalid! Check if you entered your correct username or password', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  argumentName: 'password'
                }
              });
            case 18:
              if (!(!user || !passwordVerified)) {
                _context6.next = 22;
                break;
              }
              throw new _graphql.GraphQLError('Wrong credentials! Check if you entered your correct username or password', {
                extensions: {
                  code: 'BAD_USER_INPUT'
                }
              });
            case 22:
              if (!(user && passwordVerified)) {
                _context6.next = 38;
                break;
              }
              _context6.prev = 23;
              userToken = {
                username: user.username,
                id: user._id
              };
              token = _jsonwebtoken.default.sign(userToken, _config.jwt_key, {
                expiresIn: '1h'
              });
              decode = _jsonwebtoken.default.decode(token, _config.jwt_key);
              userId = decode.id;
              loginUsername = user.username;
              msg = "Welcome back ".concat(loginUsername);
              return _context6.abrupt("return", {
                token: token,
                id: userId,
                username: loginUsername,
                successLoginMessage: msg
              });
            case 33:
              _context6.prev = 33;
              _context6.t0 = _context6["catch"](23);
              throw new _graphql.GraphQLError("Can't processed login request", {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 36:
              _context6.next = 39;
              break;
            case 38:
              throw new _graphql.GraphQLError("Can't processed login request", {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 39:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[23, 33]]);
      }));
      function login(_x15, _x16) {
        return _login.apply(this, arguments);
      }
      return login;
    }(),
    createRepository: function () {
      var _createRepository = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(_, args, contextValue) {
        var authUser, repo, newRepo;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              authUser = contextValue.authUser;
              if (authUser) {
                _context7.next = 3;
                break;
              }
              throw new _graphql.GraphQLError('User is not authenticated', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: {
                    status: 401
                  }
                }
              });
            case 3:
              _context7.prev = 3;
              repo = new _repository2.default(_objectSpread(_objectSpread({}, args.repositoryInput), {}, {
                user: _mongoose.default.Types.ObjectId(authUser.id)
              }));
              _context7.next = 7;
              return _repository2.default.create(repo);
            case 7:
              newRepo = _context7.sent;
              if (!newRepo) {
                _context7.next = 12;
                break;
              }
              authUser.repositories = authUser.repositories.concat(newRepo);
              _context7.next = 12;
              return authUser.save();
            case 12:
              return _context7.abrupt("return", newRepo);
            case 15:
              _context7.prev = 15;
              _context7.t0 = _context7["catch"](3);
              throw new _graphql.GraphQLError("Error: ".concat(_context7.t0.message), {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  http: {
                    status: 400
                  },
                  arguementName: args
                }
              });
            case 18:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[3, 15]]);
      }));
      function createRepository(_x17, _x18, _x19) {
        return _createRepository.apply(this, arguments);
      }
      return createRepository;
    }()
  },
  User: {
    id: function () {
      var _id = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(parent) {
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt("return", parent.id);
            case 1:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function id(_x20) {
        return _id.apply(this, arguments);
      }
      return id;
    }(),
    username: function () {
      var _username = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(parent) {
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.abrupt("return", parent.username);
            case 1:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function username(_x21) {
        return _username.apply(this, arguments);
      }
      return username;
    }(),
    repositories: function () {
      var _repositories2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(parent) {
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", parent.repositories);
            case 1:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function repositories(_x22) {
        return _repositories2.apply(this, arguments);
      }
      return repositories;
    }()
  },
  Repository: {
    id: function () {
      var _id2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(parent) {
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              return _context11.abrupt("return", parent.id);
            case 1:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      }));
      function id(_x23) {
        return _id2.apply(this, arguments);
      }
      return id;
    }(),
    fullName: function () {
      var _fullName = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12(parent) {
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              return _context12.abrupt("return", parent.fullName);
            case 1:
            case "end":
              return _context12.stop();
          }
        }, _callee12);
      }));
      function fullName(_x24) {
        return _fullName.apply(this, arguments);
      }
      return fullName;
    }(),
    description: function () {
      var _description = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13(parent) {
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              return _context13.abrupt("return", parent.description);
            case 1:
            case "end":
              return _context13.stop();
          }
        }, _callee13);
      }));
      function description(_x25) {
        return _description.apply(this, arguments);
      }
      return description;
    }(),
    language: function () {
      var _language = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14(parent) {
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              return _context14.abrupt("return", parent.language);
            case 1:
            case "end":
              return _context14.stop();
          }
        }, _callee14);
      }));
      function language(_x26) {
        return _language.apply(this, arguments);
      }
      return language;
    }(),
    forksCount: function () {
      var _forksCount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15(parent) {
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              return _context15.abrupt("return", parent.forksCount);
            case 1:
            case "end":
              return _context15.stop();
          }
        }, _callee15);
      }));
      function forksCount(_x27) {
        return _forksCount.apply(this, arguments);
      }
      return forksCount;
    }(),
    stargazersCount: function () {
      var _stargazersCount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee16(parent) {
        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              return _context16.abrupt("return", parent.stargazersCount);
            case 1:
            case "end":
              return _context16.stop();
          }
        }, _callee16);
      }));
      function stargazersCount(_x28) {
        return _stargazersCount.apply(this, arguments);
      }
      return stargazersCount;
    }(),
    ratingAverage: function () {
      var _ratingAverage = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee17(parent) {
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              return _context17.abrupt("return", parent.ratingAverage);
            case 1:
            case "end":
              return _context17.stop();
          }
        }, _callee17);
      }));
      function ratingAverage(_x29) {
        return _ratingAverage.apply(this, arguments);
      }
      return ratingAverage;
    }(),
    reviewCount: function () {
      var _reviewCount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee18(parent) {
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              return _context18.abrupt("return", parent.reviewCount);
            case 1:
            case "end":
              return _context18.stop();
          }
        }, _callee18);
      }));
      function reviewCount(_x30) {
        return _reviewCount.apply(this, arguments);
      }
      return reviewCount;
    }(),
    ownerAvatarUrl: function () {
      var _ownerAvatarUrl = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee19(parent) {
        return _regenerator.default.wrap(function _callee19$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              return _context19.abrupt("return", parent.ownerAvatarUrl);
            case 1:
            case "end":
              return _context19.stop();
          }
        }, _callee19);
      }));
      function ownerAvatarUrl(_x31) {
        return _ownerAvatarUrl.apply(this, arguments);
      }
      return ownerAvatarUrl;
    }(),
    user: function () {
      var _user3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee20(parent) {
        var maker;
        return _regenerator.default.wrap(function _callee20$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return _user4.default.findById(parent.user).populate('repositories');
            case 2:
              maker = _context20.sent;
              return _context20.abrupt("return", maker);
            case 4:
            case "end":
              return _context20.stop();
          }
        }, _callee20);
      }));
      function user(_x32) {
        return _user3.apply(this, arguments);
      }
      return user;
    }()
  }
};
exports.resolvers = resolvers;