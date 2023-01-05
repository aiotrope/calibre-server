"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = void 0;
var typeDefs = "#graphql\n    type User {\n        username: String!\n        id: ID!\n        successSignupMessage: String\n        repositories: [Repository]!\n    }\n\n    type Token {\n        token: String!\n        id: ID!\n        username: String!\n        successLoginMessage: String!\n    }\n\n    type Repository {\n        id: ID!\n        fullName: String!\n        description: String!\n        language: String!\n        forksCount: Int!\n        stargazersCount: Int!\n        ratingAverage: Float!\n        reviewCount: Int!\n        ownerAvatarUrl: String!\n        user: User!\n    }\n\n    input RepositoryInput {\n        fullName: String!\n        description: String\n        language: String\n        forksCount: Int\n        stargazersCount: Int\n        ratingAverage: Float\n        reviewCount: Int\n        ownerAvatarUrl: String\n    }\n\n    type Query {\n        users: [User]!\n        user(id: ID!): User!\n        repositories: [Repository!]!\n        repository(id: ID!): Repository!\n    }\n\n    type Mutation {\n        signup(username: String!, password: String!): User\n        login(username: String!, password: String!): Token\n        createRepository(repositoryInput: RepositoryInput): Repository\n    }\n   \n";
exports.typeDefs = typeDefs;