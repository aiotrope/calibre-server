"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = void 0;
var typeDefs = "#graphql\n    type User {\n        username: String!\n        id: ID!\n        successSignupMessage: String\n    }\n\n    type Token {\n        token: String!\n        id: ID!\n        username: String!\n        successLoginMessage: String!\n    }\n\n    type Query {\n        users: [User]!\n        user(id: ID!): User!\n    }\n\n    type Mutation {\n        signup(username: String!, password: String!): User\n        login(username: String!, password: String!): Token\n    }\n   \n";
exports.typeDefs = typeDefs;