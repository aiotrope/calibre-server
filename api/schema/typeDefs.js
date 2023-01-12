export const typeDefs = `#graphql
    type User {
        username: String!
        id: ID!
        successSignupMessage: String
        repositories: [Repository]!
        reviewsCreated: [Review!]!
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
        ratingAverage: Float
        reviewCount: Int
        ownerAvatarUrl: String!
        url: String!
        createdAt: String!
        updatedAt: String!
        user: User!
        reviews: [Review!]!
    }

    input RepositoryInput {
        fullName: String!
        description: String
        language: String
        forksCount: Int
        stargazersCount: Int
        ownerAvatarUrl: String
    }

    type Review {
        id: ID!
        repositoryIdentification: String!
        rating: Int!
        reviewText: String!
        createdAt: String!
        updatedAt: String!
        user: User!
        repository: Repository!
    }

    type Query {
        users: [User]!
        me: User!
        repositories(searchKeyword: String): [Repository!]!
        repository(id: ID!): Repository!
        reviews: [Review!]!
        review(id: ID!): Review!
    }

    type Mutation {
        signup(username: String!, password: String!): User
        login(username: String!, password: String!): Token
        createRepository(repositoryInput: RepositoryInput): Repository
        createReview(repositoryIdentification: String!, rating: Int!, reviewText: String!): Review
    }
   
`
