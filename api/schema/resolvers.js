import { jwt_key } from '../utils/config.js'
import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import consola from 'consola'
import User from '../models/user.js'
import Repository from '../models/repository.js'

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
        const users = await User.find({}).populate('repositories')

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
    user: async (_, args, contextValue) => {
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
        const user = await User.findById(args.id).populate('repositories')
        return user
      } catch (error) {
        throw new GraphQLError(
          `Can't processed user with ${args.id}: ${error.message}`,
          {
            extensions: { code: 'BAD_REQUEST' },
          }
        )
      }
    },
    repositories: async (_, __, contextValue) => {
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
        const repos = await Repository.find({}).populate('user')
        return repos
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
        const repo = await Repository.findById(args.id).populate('user')
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
        const repo = new Repository({
          ...args.repositoryInput,
          user: mongoose.Types.ObjectId(authUser.id),
        })
        const newRepo = await Repository.create(repo)
        if (newRepo) {
          authUser.repositories = authUser.repositories.concat(newRepo)
          await authUser.save()
        }

        return newRepo
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
  },
  Repository: {
    id: async (parent) => {
      return parent.id
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
    forksCount: async (parent) => {
      return parent.forksCount
    },
    stargazersCount: async (parent) => {
      return parent.stargazersCount
    },
    ratingAverage: async (parent) => {
      return parent.ratingAverage
    },
    reviewCount: async (parent) => {
      return parent.reviewCount
    },
    ownerAvatarUrl: async (parent) => {
      return parent.ownerAvatarUrl
    },
    user: async (parent) => {
      const maker = await User.findById(parent.user).populate('repositories')
      return maker
    },
  },
}
