import { gql } from '@apollo/client'

export const ME = gql`
  query ME {
    me {
      id
      username
      repositories {
        id
        fullName
        description
        language
        forksCount
        stargazersCount
        ratingAverage
        reviewCount
        ownerAvatarUrl
        url
        user {
          id
          username
        }
      }
    }
  }
`

export const REPOSITORIES = gql`
  query REPOSITORIES {
    repositories {
      id
      fullName
      description
      language
      forksCount
      stargazersCount
      ownerAvatarUrl
      url
      reviewCount
      ratingAverage
      user {
        id
        username
      }
      reviews {
        id
        reviewText
        rating
      }
      createdAt
      updatedAt
    }
  }
`

export const REPOSITORY = gql`
  query REPOSITORY($repositoryId: ID!) {
    repository(id: $repositoryId) {
      id
      fullName
      description
      language
      forksCount
      stargazersCount
      ownerAvatarUrl
      url
      reviewCount
      ratingAverage
      user {
        id
        username
      }
      reviews {
        id
        reviewText
        rating
      }
      createdAt
      updatedAt
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
      user {
        id
        username
      }
      repository {
        id
        fullName
        ratingAverage
        reviewCount
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
      user {
        id
        username
      }
      repository {
        id
        fullName
        ratingAverage
        reviewCount
      }
    }
  }
`
