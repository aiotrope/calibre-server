import { jwt_key } from '../utils/config.js'
//import { PubSub } from 'graphql-subscriptions'
import { GraphQLError } from 'graphql'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import consola from 'consola'
//import mongoose from 'mongoose'
//import pkg from 'lodash'

//const pubsub = new PubSub()
//const { countBy, filter, map, includes } = pkg

export const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.find({})
        return users
      } catch (error) {
        consola.error(error.message)
      }
    },
    user: async (parent, args) => {
      const user = await User.findById(args.id)
      return user
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
  },
}
