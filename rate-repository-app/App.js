import { NativeRouter } from 'react-router-native'
import { ApolloProvider } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Main from './src/components/Main'
import client from './src/utils/client'

const apolloClient = client()

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <SafeAreaProvider>
          <Main />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </ApolloProvider>
    </NativeRouter>
  )
}

export default App
