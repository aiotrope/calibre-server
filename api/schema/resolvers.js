import { jwt_key } from '../utils/config.js'
import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import consola from 'consola'
import pkg from 'lodash'
import fetch from 'node-fetch'

import User from '../models/user.js'
import Repository from '../models/repository.js'
import Review from '../models/review.js'

const { meanBy, countBy, filter, includes } = pkg

export const resolvers = {
  Query: {
    users: async (_, __, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }

      try {
        const users = await User.find({})
          .populate('repositories')
          .populate('reviewsCreated')

        return users
      } catch (error) {
        throw new GraphQLError(
          `Can't processed users request: ${error.message}!`,
          {
            extensions: { code: 'BAD_REQUEST' },
          }
        )
      }
    },
    me: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }
      try {
        return authUser
      } catch (error) {
        throw new GraphQLError(
          `Can't processed user with ${args.id}: ${error.message}`,
          {
            extensions: { code: 'BAD_REQUEST' },
          }
        )
      }
    },
    repositories: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }

      const repos = await Repository.find({})
        .populate('user')
        .populate('reviews')
      let response
      try {
        if (args.searchKeyword) {
          //response = filter(repos, { fullName: args.searchKeyword })
          response = filter(repos, (val) =>
            includes(
              args.searchKeyword.toUpperCase(),
              val.fullName.toUpperCase()
            )
          )
          return response
        } else {
          return repos
        }
      } catch (error) {
        throw new GraphQLError(
          `Can't processed users request: ${error.message}!`,
          {
            extensions: { code: 'BAD_REQUEST' },
          }
        )
      }
    },
    repository: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }
      try {
        const repo = await Repository.findById(args.id)
          .populate('user')
          .populate('reviews')
        return repo
      } catch (error) {
        throw new GraphQLError(
          `Can't processed user with ${args.id}: ${error.message}`,
          {
            extensions: { code: 'BAD_REQUEST' },
          }
        )
      }
    },

    reviews: async (_, __, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }

      try {
        const reviewsObj = await Review.find({})
          .populate('user')
          .populate('repository')
        return reviewsObj
      } catch (error) {
        throw new GraphQLError(
          `Can't processed users request: ${error.message}!`,
          {
            extensions: { code: 'BAD_REQUEST' },
          }
        )
      }
    },
    review: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }
      try {
        const reviewObj = await Review.findById(args.id)
          .populate('user')
          .populate('repository')
        return reviewObj
      } catch (error) {
        throw new GraphQLError(
          `Can't processed user with ${args.id}: ${error.message}`,
          {
            extensions: { code: 'BAD_REQUEST' },
          }
        )
      }
    },
  },
  Mutation: {
    signup: async (parent, args) => {
      const duplicateUsername = await User.findOne({
        username: args.username,
      })
      const regexPass =
        /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{3,}$/gm
      const regexUser =
        /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{5,}$/gm
      const testPassword = regexPass.test(args.password)
      const testUsername = regexUser.test(args.username)

      if (args.username.length < 5 && !testUsername) {
        throw new GraphQLError(
          `${args.username} invalid! Must be at least 5 characters upper/lower case, numbers and special characters are allowed.`,
          { extensions: { code: 'BAD_USER_INPUT', argumentName: 'username' } }
        )
      } else if (args.password.length < 3 && !testPassword) {
        throw new GraphQLError(
          `${args.password} invalid! Password must be at least 3 characters in length.`,
          { extensions: { code: 'BAD_USER_INPUT', argumentName: 'password' } }
        )
      } else if (duplicateUsername) {
        throw new GraphQLError(
          `${args.username} invalid! The username you entered is already been taken.`,
          { extensions: { code: 'BAD_USER_INPUT', argumentName: 'username' } }
        )
      } else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(args.password, saltRounds)
        const user = new User({
          username: args.username,
          passwordHash: passwordHash,
        })

        try {
          const newUser = await User.create(user)

          if (newUser) {
            const response = {
              id: newUser.id,
              username: newUser.username,
              successSignupMessage: `${newUser.username} signup successful!`,
            }

            return response
          }
        } catch (error) {
          consola.error(error.message)
          throw new GraphQLError(
            "Can't processed createUser request due to some internal issues.",
            { extensions: { code: 'BAD_REQUEST' } }
          )
        }
      }
    },
    login: async (parent, args) => {
      const user = await User.findOne({ username: args.username })
      const passwordVerified = await bcrypt.compare(
        args.password,
        user.passwordHash
      )
      const regexPass =
        /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{3,}$/gm
      const regexUser =
        /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{5,}$/gm
      const testPassword = regexPass.test(args.password)
      const testUsername = regexUser.test(args.username)
      if (args.username.length < 5 || !testUsername) {
        throw new GraphQLError(
          'Invalid! Check if you entered your correct username or password',
          { extensions: { code: 'BAD_USER_INPUT', argumentName: 'username' } }
        )
      } else if (args.password.length < 3 || !testPassword) {
        throw new GraphQLError(
          'Invalid! Check if you entered your correct username or password',
          { extensions: { code: 'BAD_USER_INPUT', argumentName: 'password' } }
        )
      } else if (!user || !passwordVerified) {
        throw new GraphQLError(
          'Wrong credentials! Check if you entered your correct username or password',
          { extensions: { code: 'BAD_USER_INPUT' } }
        )
      } else if (user && passwordVerified) {
        try {
          const userToken = {
            username: user.username,
            id: user._id,
          }
          const token = jwt.sign(userToken, jwt_key, { expiresIn: '1h' })
          const decode = jwt.decode(token, jwt_key)
          const userId = decode.id
          const loginUsername = user.username
          const msg = `Welcome back ${loginUsername}`

          return {
            token: token,
            id: userId,
            username: loginUsername,
            successLoginMessage: msg,
          }
        } catch (error) {
          throw new GraphQLError("Can't processed login request", {
            extensions: { code: 'BAD_REQUEST' },
          })
        }
      } else {
        throw new GraphQLError("Can't processed login request", {
          extensions: { code: 'BAD_REQUEST' },
        })
      }
    },
    createRepository: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }

      try {
        const ghAPI = `https://api.github.com/repos/${args.repositoryInput.ownerName}/${args.repositoryInput.repositoryName}`
        const response = await fetch(ghAPI)
        const json = await response.json()
        //consola.log(json)
        if (json) {
          const repo = new Repository({
            ...args.repositoryInput,
            user: mongoose.Types.ObjectId(authUser.id),
            fullName: json?.full_name,
            description: json?.description,
            language: json?.language,
            url: json?.html_url,
            avatarUrl: json?.owner?.avatar_url,
            forksCount: json?.forks_count,
            stargazersCount: json?.stargazers_count,
          })
          const newRepo = await Repository.create(repo)
          if (newRepo) {
            authUser.repositories = authUser.repositories.concat(newRepo)
            await authUser.save()
          }

          return newRepo
        }
      } catch (error) {
        throw new GraphQLError(`Error: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 },
            arguementName: args,
          },
        })
      }
    },

    createReview: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }
      if (args.rating < 0 || args.rating > 100) {
        throw new GraphQLError(
          `Field only accept numbers from 0 - 100. Got ${args.rating}`,
          { extensions: { code: 'BAD_USER_INPUT', argumentName: 'rating' } }
        )
      }

      try {
        const review = new Review({
          ...args,
          user: mongoose.Types.ObjectId(authUser.id),
          repository: mongoose.Types.ObjectId(args.repositoryIdentification),
        })
        const newReview = await Review.create(review)
        if (newReview) {
          authUser.reviewsCreated = authUser.reviewsCreated.concat(newReview)
          await authUser.save()

          const repo = await Repository.findById(args.repositoryIdentification)
          repo.reviews = repo.reviews.concat(newReview)
          await repo.save()
        }

        return newReview
      } catch (error) {
        throw new GraphQLError(`Error: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 },
            arguementName: args,
          },
        })
      }
    },
  },
  User: {
    id: async (parent) => {
      return parent.id
    },
    username: async (parent) => {
      return parent.username
    },
    repositories: async (parent) => {
      return parent.repositories
    },
    reviewsCreated: async (parent) => {
      return parent.reviewsCreated
    },
  },
  Repository: {
    id: async (parent) => {
      return parent.id
    },
    ownerName: async (parent) => {
      return parent.ownerName
    },
    repositoryName: async (parent) => {
      return parent.repositoryName
    },
    ratingAverage: async (parent) => {
      const reviews = await Review.find({ repository: parent.id })
      if (parent.ratingAverage === null) return 0
      if (reviews.length < 1) return 0
      try {
        const mean = meanBy(reviews, 'rating')
        return mean.toFixed(2)
      } catch (error) {
        consola.error(error?.extensions?.code)
        throw new GraphQLError('Cannot processed rating average request!')
      }
    },
    reviewCount: async (parent) => {
      const reviews = await Review.find({ repository: parent.id })
      if (parent.reviewCount === null) return 0
      if (reviews.length < 1) return 0

      try {
        const repoName = countBy(reviews, 'repository')
        const reviewByRepository = repoName[parent.id]
        if (reviewByRepository) return reviewByRepository
      } catch (error) {
        consola.error(error?.extensions?.code)
        throw new GraphQLError('Cannot processed review count request!')
      }
    },
    createdAt: async (parent) => {
      const obj = await Repository.findById(parent.id)
      return obj.createdAt.toUTCString()
    },
    updatedAt: async (parent) => {
      const obj = await Repository.findById(parent.id)
      return obj.updatedAt.toUTCString()
    },

    user: async (parent) => {
      const maker = await User.findById(parent.user).populate('repositories')
      return maker
    },
    reviews: async (parent) => {
      return parent.reviews
    },
    fullName: async (parent) => {
      return parent.fullName
    },
    description: async (parent) => {
      return parent.description
    },
    language: async (parent) => {
      return parent.language
    },
    url: async (parent) => {
      return parent.url
    },
    forksCount: async (parent) => {
      return parent.forksCount
    },
    stargazersCount: async (parent) => {
      return parent.stargazersCount
    },
    avatarUrl: async (parent) => {
      return parent.avatarUrl
    },
  },
  Review: {
    id: async (parent) => {
      return parent.id
    },
    repositoryIdentification: async (parent) => {
      return parent.repositoryIdentification
    },
    rating: async (parent) => {
      return parent.rating
    },
    reviewText: async (parent) => {
      return parent.reviewText
    },
    repository: async (parent) => {
      const repo = await Repository.findById(parent.repository)
        .populate('reviews')
        .populate('user')
      return repo
    },
    user: async (parent) => {
      const maker = await User.findById(parent.user)
        .populate('repositories')
        .populate('reviewsCreated')
      return maker
    },
    createdAt: async (parent) => {
      const obj = await Review.findById(parent.id)
      return obj.createdAt.toUTCString()
    },
    updatedAt: async (parent) => {
      const obj = await Review.findById(parent.id)
      return obj.updatedAt.toUTCString()
    },
  },
}
