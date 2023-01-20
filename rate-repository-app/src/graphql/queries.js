import { gql } from '@apollo/client'

export const USERS = gql`
  query USERS($first: Int, $after: String) {
    users(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          username
        }
      }
    }
  }
`

export const ME = gql`
  query ME(
    $first: Int
    $after: String
    $reviewsCreatedFirst2: Int
    $reviewsCreatedAfter2: String
  ) {
    me {
      id
      username
      repositories(first: $first, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            ownerName
            repositoryName
            ratingAverage
            reviewCount
            fullName
            description
            language
            url
            avatarUrl
            forksCount
            stargazersCount
            createdAt
            updatedAt
          }
        }
      }
      reviewsCreated(
        first: $reviewsCreatedFirst2
        after: $reviewsCreatedAfter2
      ) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            rating
            reviewText
            createdAt
            updatedAt
            user {
              id
              username
            }
            repository {
              id
              fullName
              url
            }
          }
        }
      }
    }
  }
`

export const REPOSITORIES = gql`
  query REPOSITORIES($searchKeyword: String, $first: Int, $after: String) {
    repositories(searchKeyword: $searchKeyword, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          ownerName
          repositoryName
          reviewCount
          ratingAverage
          fullName
          description
          language
          url
          avatarUrl
          forksCount
          stargazersCount
          createdAt
          updatedAt
          user {
            id
            username
          }
        }
      }
    }
  }
`

export const REPOSITORY = gql`
  query REPOSITORY($repositoryId: ID!, $first: Int, $after: String) {
    repository(id: $repositoryId) {
      id
      ownerName
      repositoryName
      reviewCount
      ratingAverage
      fullName
      description
      language
      url
      avatarUrl
      forksCount
      stargazersCount
      createdAt
      updatedAt
      user {
        id
        username
      }
      reviews(first: $first, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            rating
            reviewText
            createdAt
            updatedAt
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`

export const REVIEWS = gql`
  query REVIEWS($first: Int, $after: String) {
    reviews(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          repositoryIdentification
          rating
          reviewText
          createdAt
          updatedAt
          user {
            id
            username
          }
          repository {
            id
            repositoryName
            ownerName
            ratingAverage
            reviewCount
            fullName
            description
            language
            url
            avatarUrl
            forksCount
            stargazersCount
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`

export const REVIEW = gql`
  query REVIEW($reviewId: ID!) {
    review(id: $reviewId) {
      id
      repositoryIdentification
      rating
      reviewText
      updatedAt
      createdAt
      user {
        id
        username
      }
      repository {
        id
        repositoryName
        ownerName
        ratingAverage
        reviewCount
        fullName
        description
        language
        url
        avatarUrl
        forksCount
        stargazersCount
        updatedAt
        createdAt
      }
    }
  }
`
