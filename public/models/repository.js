"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
var RepositorySchema = new _mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true,
    minLength: 2
  },
  description: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    trim: true
  },
  forksCount: {
    type: Number
  },
  stargazersCount: {
    type: Number
  },
  ratingAverage: {
    type: Number
  },
  reviewCount: {
    type: Number
  },
  ownerAvatarUrl: {
    type: String,
    trim: true
  },
  user: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
RepositorySchema.set('toJSON', {
  transform: function transform(document, retObject) {
    retObject.id = retObject._id.toString();
    delete retObject._id;
    delete retObject.__v;
  }
});
var Repository = (0, _mongoose.model)('Repository', RepositorySchema);
var _default = Repository;
exports.default = _default;