export const typeDefs = `#graphql
    type User {
        username: String!
        id: ID!
        successSignupMessage: String
        repositories(first: Int, after: String): RepositoryConnection
        reviewsCreated(first: Int, after: String): ReviewConnection
    }

    type Token {
        token: String!
        id: ID!
        username: String!
        successLoginMessage: String!
    }

    type UserEdge {
        cursor: String
        node: User
    }

    type UserPageInfo {
        endCursor: String
        hasNextPage: Boolean
    }

    type UserConnection {
        pageInfo: UserPageInfo
        edges: [UserEdge]
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
        reviews(first: Int, after: String): ReviewConnection!
        createdAt: String!
        updatedAt: String!
    }

    input RepositoryInput {
        ownerName: String!
        repositoryName: String!
    }

    type RepositoryEdge {
        cursor: String!
        node: Repository!
    }

    type RepositoryPageInfo {
        endCursor: String!
        hasNextPage: Boolean!
    }

    type RepositoryConnection {
        pageInfo: RepositoryPageInfo!
        edges: [RepositoryEdge!]!
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

    type ReviewEdge {
        cursor: String
        node: Review
    }

    type ReviewPageInfo {
        endCursor: String
        hasNextPage: Boolean
    }

    type ReviewConnection {
        pageInfo: ReviewPageInfo
        edges: [ReviewEdge]!
    }

    type Query {
        users(first: Int, after: String): UserConnection!
        me: User!
        repositories(searchKeyword: String, first: Int, after: String): RepositoryConnection!
        repository(id: ID!): Repository!
        reviews(first: Int, after: String): ReviewConnection!
        review(id: ID!): Review
    }

    type Mutation {
        signup(username: String!, password: String!): User
        login(username: String!, password: String!): Token
        createRepository(repositoryInput: RepositoryInput): Repository
        createReview(repositoryIdentification: String!, rating: Int!, reviewText: String!): Review
        deleteReview(reviewId: String!): Review
    }
   
`
