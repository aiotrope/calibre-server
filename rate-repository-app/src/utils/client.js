import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { defaultOptions } from './defaultOptions'

const httpLink = createHttpLink({
    uri: 'https://calibre-server.vercel.app/api'
})

const client = () => {
    return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
        defaultOptions: defaultOptions
    })
}

export default client