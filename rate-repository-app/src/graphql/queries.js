import { gql } from '@apollo/client'

export const USERS = gql`
  query USERS {
    users {
      id
      username
      repositories {
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
      reviewsCreated {
        id
        rating
        reviewText
        createdAt
        updatedAt
      }
    }
  }
`

export const ME = gql`
  query ME {
    me {
      id
      username
      repositories {
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
      reviewsCreated {
        id
        rating
        reviewText
        createdAt
        updatedAt
      }
    }
  }
`

export const REPOSITORIES = gql`
  query REPOSITORIES {
    repositories {
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
      reviews {
        id
        reviewText
        rating
        createdAt
        updatedAt
      }
    }
  }
`

export const REPOSITORY = gql`
  query REPOSITORY($repositoryId: ID!) {
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
      reviews {
        id
        reviewText
        rating
        createdAt
        updatedAt
      }
    }
  }
`

export const REVIEWS = gql`
  query REVIEWS {
    reviews {
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
`

export const REVIEW = gql`
  query ($reviewId: ID!) {
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
