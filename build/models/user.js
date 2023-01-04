"use strict";

var _mongoose = require("mongoose");
var UserSchema = new _mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    minLength: 5,
    validate: {
      validator: function validator(val) {
        return /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{5,}$/gm.test(val);
      },
      message: function message(props) {
        return "".concat(props.value, " is not a valid username!");
      }
    }
  },
  passwordHash: {
    type: String
  }
}, {
  timestamps: true
});
UserSchema.set('toJSON', {
  transform: function transform(document, retObject) {
    retObject.id = retObject._id.toString();
    delete retObject._id;
    delete retObject.__v;
    delete retObject.passwordHash;
  }
});
var User = (0, _mongoose.model)('User', UserSchema);
module.exports = User;