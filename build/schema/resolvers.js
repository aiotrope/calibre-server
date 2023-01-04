"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _config = require("../utils/config.js");
var _graphql = require("graphql");
var _user2 = _interopRequireDefault(require("../models/user.js"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _consola = _interopRequireDefault(require("consola"));
//import { PubSub } from 'graphql-subscriptions'

//import mongoose from 'mongoose'
//import pkg from 'lodash'

//const pubsub = new PubSub()
//const { countBy, filter, map, includes } = pkg

var resolvers = {
  Query: {
    users: function () {
      var _users = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _users2;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _user2.default.find({});
            case 3:
              _users2 = _context.sent;
              return _context.abrupt("return", _users2);
            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              _consola.default.error(_context.t0.message);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 7]]);
      }));
      function users() {
        return _users.apply(this, arguments);
      }
      return users;
    }(),
    user: function () {
      var _user = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(parent, args) {
        var user;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _user2.default.findById(args.id);
            case 2:
              user = _context2.sent;
              return _context2.abrupt("return", user);
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function user(_x, _x2) {
        return _user.apply(this, arguments);
      }
      return user;
    }()
  },
  Mutation: {
    signup: function () {
      var _signup = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(parent, args) {
        var duplicateUsername, regexPass, regexUser, testPassword, testUsername, saltRounds, passwordHash, user, newUser, response;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _user2.default.findOne({
                username: args.username
              });
            case 2:
              duplicateUsername = _context3.sent;
              regexPass = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{3,}$/gm;
              regexUser = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{5,}$/gm;
              testPassword = regexPass.test(args.password);
              testUsername = regexUser.test(args.username);
              if (!(args.username.length < 5 && !testUsername)) {
                _context3.next = 11;
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
                _context3.next = 15;
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
                _context3.next = 19;
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
              _context3.next = 22;
              return _bcrypt.default.hash(args.password, saltRounds);
            case 22:
              passwordHash = _context3.sent;
              user = new _user2.default({
                username: args.username,
                passwordHash: passwordHash
              });
              _context3.prev = 24;
              _context3.next = 27;
              return _user2.default.create(user);
            case 27:
              newUser = _context3.sent;
              if (!newUser) {
                _context3.next = 31;
                break;
              }
              response = {
                id: newUser.id,
                username: newUser.username,
                successSignupMessage: "".concat(newUser.username, " signup successful!")
              };
              return _context3.abrupt("return", response);
            case 31:
              _context3.next = 37;
              break;
            case 33:
              _context3.prev = 33;
              _context3.t0 = _context3["catch"](24);
              _consola.default.error(_context3.t0.message);
              throw new _graphql.GraphQLError("Can't processed createUser request due to some internal issues.", {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 37:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[24, 33]]);
      }));
      function signup(_x3, _x4) {
        return _signup.apply(this, arguments);
      }
      return signup;
    }(),
    login: function () {
      var _login = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(parent, args) {
        var user, passwordVerified, regexPass, regexUser, testPassword, testUsername, userToken, token, decode, userId, loginUsername, msg;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _user2.default.findOne({
                username: args.username
              });
            case 2:
              user = _context4.sent;
              _context4.next = 5;
              return _bcrypt.default.compare(args.password, user.passwordHash);
            case 5:
              passwordVerified = _context4.sent;
              regexPass = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{3,}$/gm;
              regexUser = /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{5,}$/gm;
              testPassword = regexPass.test(args.password);
              testUsername = regexUser.test(args.username);
              if (!(args.username.length < 5 || !testUsername)) {
                _context4.next = 14;
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
                _context4.next = 18;
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
                _context4.next = 22;
                break;
              }
              throw new _graphql.GraphQLError('Wrong credentials! Check if you entered your correct username or password', {
                extensions: {
                  code: 'BAD_USER_INPUT'
                }
              });
            case 22:
              if (!(user && passwordVerified)) {
                _context4.next = 38;
                break;
              }
              _context4.prev = 23;
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
              return _context4.abrupt("return", {
                token: token,
                id: userId,
                username: loginUsername,
                successLoginMessage: msg
              });
            case 33:
              _context4.prev = 33;
              _context4.t0 = _context4["catch"](23);
              throw new _graphql.GraphQLError("Can't processed login request", {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 36:
              _context4.next = 39;
              break;
            case 38:
              throw new _graphql.GraphQLError("Can't processed login request", {
                extensions: {
                  code: 'BAD_REQUEST'
                }
              });
            case 39:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[23, 33]]);
      }));
      function login(_x5, _x6) {
        return _login.apply(this, arguments);
      }
      return login;
    }()
  }
};
exports.resolvers = resolvers;