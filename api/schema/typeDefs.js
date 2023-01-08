export const typeDefs = `#graphql
    type User {
        username: String!
        id: ID!
        successSignupMessage: String
        repositories: [Repository]!
    }

    type Token {
        token: String!
        id: ID!
        username: String!
        successLoginMessage: String!
    }

    type Repository {
        id: ID!
        fullName: String!
        description: String!
        language: String!
        forksCount: Int!
        stargazersCount: Int!
        ratingAverage: Float!
        reviewCount: Int!
        ownerAvatarUrl: String!
        user: User!
    }

    input RepositoryInput {
        fullName: String!
        description: String
        language: String
        forksCount: Int
        stargazersCount: Int
        ratingAverage: Float
        reviewCount: Int
        ownerAvatarUrl: String
    }

    type Query {
        users: [User]!
        me: User!
        repositories: [Repository!]!
        repository(id: ID!): Repository!
    }

    type Mutation {
        signup(username: String!, password: String!): User
        login(username: String!, password: String!): Token
        createRepository(repositoryInput: RepositoryInput): Repository
    }
   
`
