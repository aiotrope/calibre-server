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
      ratingAverage
      reviewCount
      ownerAvatarUrl
      user {
        id
        username
      }
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
      ratingAverage
      reviewCount
      ownerAvatarUrl
      user {
        id
        username
      }
    }
  }
`
