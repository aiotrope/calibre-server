"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _config = require("./config.js");
var _mongoose = _interopRequireDefault(require("mongoose"));
var _consola = _interopRequireDefault(require("consola"));
var MongoDatabase = function MongoDatabase() {
  _mongoose.default.set('strictQuery', false);
  var env = process.env.NODE_ENV || 'development';
  var dbURL = _config.environment[env].dbString;
  var opts = {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  _mongoose.default.connect(dbURL, opts);
  var db = _mongoose.default.connection;
  db.once('open', function () {
    _consola.default.success("Database connected: ".concat(dbURL));
  });
  db.on('error', function (error) {
    _consola.default.error("connection error: ".concat(error));
  });
};
var _default = MongoDatabase;
exports.default = _default;