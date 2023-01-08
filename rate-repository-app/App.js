import * as React from 'react'
import { Platform } from 'react-native'
import { NativeRouter } from 'react-router-native'
import { ApolloProvider } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  configureFonts,
  MD3LightTheme,
  Provider as PaperProvider,
} from 'react-native-paper'

import Main from './src/components/Main'
//import { fontConfig } from './src/utils/fontConfig'
import createApolloClient from './src/utils/apolloClient'
import { AuthStorageProvider } from './src/contexts/AuthContext'

//onst authStorage = new AuthStorage()
const apolloClient = createApolloClient()

const fontConfig = {
  fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
}

const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
}

const App = () => {
  return (
    <>
      <NativeRouter>
        <ApolloProvider client={apolloClient}>
          <SafeAreaProvider>
            <PaperProvider theme={theme}>
              <AuthStorageProvider>
                <Main />
              </AuthStorageProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </ApolloProvider>
      </NativeRouter>
      <StatusBar style="auto" />
    </>
  )
}

export default App
