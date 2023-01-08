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
