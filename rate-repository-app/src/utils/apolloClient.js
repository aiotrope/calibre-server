import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { defaultOptions } from './defaultOptions'
import { relayStylePagination } from '@apollo/client/utilities'

const { apolloUri } = Constants.manifest.extra

const httpLink = createHttpLink({
  uri: apolloUri,
})

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: relayStylePagination(),
        repository: relayStylePagination(),
      },
    },
  },
})

const createApolloClient = () => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await AsyncStorage.getItem('auth')
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      }
    } catch (error) {
      console.log(error)
      return { headers }
    }
  })
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache,
    defaultOptions: defaultOptions,
  })
}

export default createApolloClient
