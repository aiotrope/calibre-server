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
        ownerName: String!
        repositoryName: String!
        ratingAverage: Float
        reviewCount: Int
        forksCount: Int!
        stargazersCount: Int!
        avatarUrl: String!
        fullName: String!
        description: String!
        url: String!
        language: String!
        user: User!
        reviews: [Review!]!
        createdAt: String!
        updatedAt: String!
    }

    input RepositoryInput {
        ownerName: String!
        repositoryName: String!
    }

    type Review {
        id: ID!
        repositoryIdentification: String!
        rating: Int!
        reviewText: String!
        user: User!
        repository: Repository!
        createdAt: String!
        updatedAt: String!
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
        deleteReview(reviewId: String!): Review
    }
   
`
