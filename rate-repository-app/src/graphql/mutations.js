import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      successLoginMessage
      id
      username
    }
  }
`
export const SIGNUP = gql`
  mutation signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      successSignupMessage
      id
      username
    }
  }
`

export const CREATE_REPOSITORY = gql`
  mutation createRepository($repositoryInput: RepositoryInput) {
    createRepository(repositoryInput: $repositoryInput) {
      id
      ownerName
      repositoryName
    }
  }
`

export const CREATE_REVIEW = gql`
  mutation createReview(
    $repositoryIdentification: String!
    $rating: Int!
    $reviewText: String!
  ) {
    createReview(
      repositoryIdentification: $repositoryIdentification
      rating: $rating
      reviewText: $reviewText
    ) {
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
        ownerName
        repositoryName
      }
    }
  }
`
