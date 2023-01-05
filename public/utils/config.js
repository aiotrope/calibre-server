"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.port = exports.jwt_key = exports.environment = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
_dotenv.default.config();
var port = process.env.PORT;
exports.port = port;
var jwt_key = process.env.JWT_KEY;
exports.jwt_key = jwt_key;
var mongo_url_dev = process.env.MONGODB_URI;
var mongo_url_prod = process.env.MONGODB_URI;
var environment = {
  development: {
    dbString: mongo_url_dev
  },
  production: {
    dbString: mongo_url_prod
  }
};
exports.environment = environment;