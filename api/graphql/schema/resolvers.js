import { jwt_key } from '../../utils/config.js'
import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import consola from 'consola'
import pkg from 'lodash'
import fetch from 'node-fetch'

import User from '../../models/user.js'
import Repository from '../../models/repository.js'
import Review from '../../models/review.js'

const { meanBy, countBy, map, slice, findIndex } = pkg

export const resolvers = {
  Query: {
    users: async (_, args, contextValue) => {
      const users = await User.find({})
        .populate('repositories')
        .populate('reviewsCreated')
      const countUsers = await User.countDocuments({})
      let first = 10
      let after = 0
      const authUser = contextValue.authUser

      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }

      if (args.first !== undefined) {
        const min_val = 1
        const max_val = 25

        if (args.first < min_val || args.first > max_val) {
          throw new GraphQLError(
            `${args.first} invalid(min value: ${min_val}, max: ${max_val}) .`,
            { extensions: { code: 'BAD_USER_INPUT', argumentName: 'first' } }
          )
        }

        first = args.first
      }

      if (args.after !== undefined) {
        const index = findIndex(users, (i) => i.id === args.after)

        if (index === -1) {
          throw new GraphQLError(`${args.after} invalid: cursor not found!`, {
            extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
          })
        }
        after = index + 1
        if (after === countUsers) {
          throw new GraphQLError(
            `Invalid ${args.after} value: no items after provided cursor.`,
            {
              extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
            }
          )
        }
      }

      try {
        const returnedUsers = slice(users, after, after + first)
        const lastUser = returnedUsers[countUsers - 1]
        return {
          pageInfo: {
            endCursor: lastUser.id,
            hasNextPage: after + first < countUsers,
          },
          edges: map(users, function (user) {
            return { cursor: user.id, node: user }
          }),
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
    me: async (parent, args, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }
      const countRepos = authUser.repositories.length
      const countReviews = authUser.reviewsCreated.length
      let first = 10
      let after = 0
      if (args.first !== undefined) {
        const min_val = 1
        const max_val = 25

        if (args.first < min_val || args.first > max_val) {
          throw new GraphQLError(
            `${args.first} invalid(min value: ${min_val}, max: ${max_val}) .`,
            { extensions: { code: 'BAD_USER_INPUT', argumentName: 'first' } }
          )
        }

        first = args.first
      }

      if (args.after !== undefined) {
        const index = findIndex(
          authUser.repositories,
          (i) => i.id === args.after
        )

        if (index === -1) {
          throw new GraphQLError(`${args.after} invalid: cursor not found!`, {
            extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
          })
        }
        after = index + 1
        if (after === countRepos) {
          throw new GraphQLError(
            `Invalid ${args.after} value: no items after provided cursor.`,
            {
              extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
            }
          )
        }
      }
      try {
        const returnedRepos = slice(authUser.repositories, after, after + first)
        const returnedReviews = slice(
          authUser.reviewsCreated,
          after,
          after + first
        )
        const lastRepo = returnedRepos[countRepos - 1]
        const lastReview = returnedReviews[countReviews - 1]
        //console.log(authUser)
        return {
          id: authUser.id,
          username: authUser.username,
          successSignupMessage: authUser.successSignupMessage,
          repositories: {
            pageInfo: {
              endCursor: lastRepo.id,
              hasNextPage: after + first < countRepos,
            },
            edges: map(authUser.repositories, function (repo) {
              return { cursor: repo.id, node: repo }
            }),
          },
          reviewsCreated: {
            pageInfo: {
              endCursor: lastReview.id,
              hasNextPage: after + first < countReviews,
            },
            edges: map(authUser.reviewsCreated, function (review) {
              return { cursor: review.id, node: review }
            }),
          },
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
    repositories: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      const repos = await Repository.find({})
        .populate('user')
        .populate('reviews')
      const countRepos = await Repository.countDocuments({})
      let first = 10
      let after = 0

      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }

      if (args.first !== null) {
        const min_val = 1
        const max_val = 25

        if (args.first < min_val || args.first > max_val) {
          throw new GraphQLError(
            `${args.first} invalid(min value: ${min_val}, max: ${max_val}) .`,
            { extensions: { code: 'BAD_USER_INPUT', argumentName: 'first' } }
          )
        }

        first = args.first
      }

      if (args.after !== null) {
        const index = findIndex(repos, (i) => i.id === args.after)

        if (index === -1) {
          throw new GraphQLError(`${args.after} invalid: cursor not found!`, {
            extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
          })
        }
        after = index + 1
        if (after === countRepos) {
          throw new GraphQLError(
            `Invalid ${args.after} value: no items after provided cursor.`,
            {
              extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
            }
          )
        }
      }

      if (args.searchKeyword) {
        const searchRepo = await Repository.find({
          $or: [
            {
              fullName: {
                $regex: new RegExp('^' + args.searchKeyword.toLowerCase(), 'i'),
              },
            },
            {
              ownerName: {
                $regex: new RegExp('^' + args.searchKeyword.toLowerCase(), 'i'),
              },
            },
            {
              repositoryName: {
                $regex: new RegExp('^' + args.searchKeyword.toLowerCase(), 'i'),
              },
            },
            {
              url: {
                $regex: new RegExp('^' + args.searchKeyword.toLowerCase(), 'i'),
              },
            },
            {
              language: {
                $regex: new RegExp('^' + args.searchKeyword.toLowerCase(), 'i'),
              },
            },
          ],
        })
          .populate('user')
          .populate('reviews')

        return {
          edges: map(searchRepo, function (repo) {
            return { cursor: repo.id, node: repo }
          }),
        }
      }
      try {
        const returnedRepos = slice(repos, after, after + first)
        const lastRepo = returnedRepos[countRepos - 1]
        return {
          pageInfo: {
            endCursor: lastRepo.id,
            hasNextPage: after + first < countRepos,
          },
          edges: map(repos, function (repo) {
            return { cursor: repo.id, node: repo }
          }),
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

      const repo = await Repository.findById(args.id)
        .populate('user')
        .populate('reviews')

      const countReviews = repo.reviews.length
      let first = 10
      let after = 0
      if (countReviews > 0) {
        if (args.first !== undefined) {
          const min_val = 1
          const max_val = 25

          if (args.first < min_val || args.first > max_val) {
            throw new GraphQLError(
              `${args.first} invalid(min value: ${min_val}, max: ${max_val}) .`,
              { extensions: { code: 'BAD_USER_INPUT', argumentName: 'first' } }
            )
          }

          first = args.first
        }

        if (args.after !== undefined) {
          const index = findIndex(repo.reviews, (i) => i.id === args.after)

          if (index === -1) {
            throw new GraphQLError(`${args.after} invalid: cursor not found!`, {
              extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
            })
          }
          after = index + 1
          if (after === countReviews) {
            throw new GraphQLError(
              `Invalid ${args.after} value: no items after provided cursor.`,
              {
                extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
              }
            )
          }
        }

        try {
          const returnedReviews = slice(repo.reviews, after, after + first)
          const lastReview = returnedReviews[countReviews - 1]
          return {
            id: repo.id,
            ownerName: repo.ownerName,
            repositoryName: repo.repositoryName,
            ratingAverage: repo.ratingAverage,
            reviewCount: repo.reviewCount,
            forksCount: repo.forksCount,
            stargazersCount: repo.stargazersCount,
            avatarUrl: repo.avatarUrl,
            fullName: repo.fullName,
            description: repo.description,
            url: repo.url,
            language: repo.language,
            user: repo.user,
            createdAt: repo.createdAt.toISOString(),
            updatedAt: repo.updatedAt.toISOString(),
            reviews: {
              pageInfo: {
                endCursor: lastReview.id,
                hasNextPage: after + first < countReviews,
              },
              edges: map(repo.reviews, function (review) {
                return { cursor: review.id, node: review }
              }),
            },
          }
        } catch (error) {
          throw new GraphQLError(
            `Can't processed users request: ${error.message}!`,
            {
              extensions: { code: 'BAD_REQUEST' },
            }
          )
        }
      }
      return repo
    },

    reviews: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      const reviews = await Review.find({})
        .populate('user')
        .populate('repository')
      const countReviews = await Review.countDocuments({})
      let first = 10
      let after = 0
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }
      if (args.first !== undefined) {
        const min_val = 1
        const max_val = 25

        if (args.first < min_val || args.first > max_val) {
          throw new GraphQLError(
            `${args.first} invalid(min value: ${min_val}, max: ${max_val}) .`,
            { extensions: { code: 'BAD_USER_INPUT', argumentName: 'first' } }
          )
        }

        first = args.first
      }

      if (args.after !== undefined) {
        const index = findIndex(reviews, (i) => i.id === args.after)

        if (index === -1) {
          throw new GraphQLError(`${args.after} invalid: cursor not found!`, {
            extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
          })
        }
        after = index + 1
        if (after === countReviews) {
          throw new GraphQLError(
            `Invalid ${args.after} value: no items after provided cursor.`,
            {
              extensions: { code: 'BAD_USER_INPUT', argumentName: 'after' },
            }
          )
        }
      }

      try {
        const returnedReviews = slice(reviews, after, after + first)
        const lastReview = returnedReviews[countReviews - 1]
        return {
          pageInfo: {
            endCursor: lastReview.id,
            hasNextPage: after + first < countReviews,
          },
          edges: map(reviews, function (review) {
            return { cursor: review.id, node: review }
          }),
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
    review: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      const review = await Review.findById(args.id)
        .populate('user')
        .populate('repository')

      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }
      try {
        return review
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
    deleteReview: async (_, args, contextValue) => {
      const authUser = contextValue.authUser
      if (!authUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }

      const byUserReview = await Review.findOne({
        _id: args.reviewId,
        user: authUser.id,
      })
        .populate('user')
        .populate('repository')

      if (!byUserReview) {
        throw new GraphQLError('Cannot processed review delete request!', {
          extensions: {
            code: 'BAD_REQUEST',
            http: { status: 400 },
            arguementName: args,
          },
        })
      }
      try {
        const selectedReview = await Review.findByIdAndDelete(args.reviewId)
          .populate('user')
          .populate('repository')
        return selectedReview
      } catch (error) {
        throw new GraphQLError('Cannot processed review delete request!', {
          extensions: {
            code: 'BAD_REQUEST',
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

  UserConnection: {
    pageInfo: async (parent) => {
      return parent.pageInfo
    },
    edges: async (parent) => {
      return parent.edges
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
      return obj.createdAt.toISOString()
    },
    updatedAt: async (parent) => {
      const obj = await Repository.findById(parent.id)
      return obj.updatedAt.toISOString()
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
  RepositoryConnection: {
    pageInfo: async (parent) => {
      return parent.pageInfo
    },
    edges: async (parent) => {
      if (parent.edges) return parent.edges
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
      return obj.createdAt.toISOString()
    },
    updatedAt: async (parent) => {
      const obj = await Review.findById(parent.id)
      return obj.updatedAt.toISOString()
    },
  },
  ReviewConnection: {
    pageInfo: async (parent) => {
      return parent.pageInfo
    },
    edges: async (parent) => {
      return parent.edges
    },
  },
}
