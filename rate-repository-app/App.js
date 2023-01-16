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

import createApolloClient from './src/utils/apolloClient'
import { AuthStorageProvider } from './src/contexts/AuthContext'
import { GeneralProvider } from './src/contexts/GeneralContext'
import Main from './src/components/Main'

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
      <ApolloProvider client={apolloClient}>
        <PaperProvider theme={theme}>
          <GeneralProvider>
            <AuthStorageProvider>
              <SafeAreaProvider>
                <NativeRouter>
                  <Main />
                </NativeRouter>
              </SafeAreaProvider>
            </AuthStorageProvider>
          </GeneralProvider>
        </PaperProvider>
      </ApolloProvider>

      <StatusBar style="auto" />
    </>
  )
}

export default App
