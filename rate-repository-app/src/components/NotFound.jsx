import * as React from 'react'
import { useRouteError, Link, Redirect } from 'react-router-native'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { useAuthStorage } from '../contexts/AuthContext'

const NotFound = () => {
  const error = useRouteError()
  const { token } = useAuthStorage()

  if (!token) {
    return <Redirect to={'/signin'} />
  }
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Oops!</Text>
      <Text variant="bodyMedium">Sorry, an unexpected error has occurred.</Text>
      <Text variant="bodyMedium">
        <Text variant="bodySmall">{error.statusText || error.message}</Text>
      </Text>

      <Link to={'/'}>
        Go to <Text>Home</Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#FFFFFF',
  },
})

export default NotFound
