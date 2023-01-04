export const typeDefs = `#graphql
    type User {
        username: String!
        id: ID!
        successSignupMessage: String
    }

    type Token {
        token: String!
        id: ID!
        username: String!
        successLoginMessage: String!
    }

    type Query {
        users: [User]!
        user(id: ID!): User!
    }

    type Mutation {
        signup(username: String!, password: String!): User
        login(username: String!, password: String!): Token
    }
   
`
