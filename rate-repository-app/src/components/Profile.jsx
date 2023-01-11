import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button, List } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApolloClient, useQuery } from '@apollo/client'
import { Navigate } from 'react-router-native'
import Spinner from 'react-native-loading-spinner-overlay'

import { useAuthStorage } from '../contexts/AuthContext'
//import { useAuthStorage } from '../hooks/useAuthStorage'
import { ME } from '../graphql/queries'

const Profile = ({ mounted, setErrorMessage }) => {
  const client = useApolloClient()
  const { token, setToken, setMe } = useAuthStorage()
  const { loading, error, data } = useQuery(ME)

  React.useEffect(() => {
    const setUser = async () => {
      try {
        if (mounted && token !== null) {
          setMe(data?.me)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      } catch (error) {
        console.error(error)
      }
    }
    setUser()
  }, [])

  React.useEffect(() => {
    if (mounted && error) {
      setErrorMessage(error?.message)
      let timer
      timer = setTimeout(() => {
        setErrorMessage('')
        clearTimeout(timer)
      }, 9000)
    }
  }, [error, mounted, setErrorMessage])

  const onSignOut = async () => {
    try {
      await client.resetStore()
      setToken(null)
      setMe(null)
      await AsyncStorage.removeItem('auth')
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return (
      <Spinner
        visible={true}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  if (token === null) return <Navigate to={'/signin'} />
  const currentUser = data?.me

  return (
    <View>
      <Text>Profile</Text>
      <View key={currentUser.id} style={{ marginTop: 3, marginBottom: 3 }}>
        <List.Item
          title="User ID"
          description={currentUser.id}
          left={(props) => <List.Icon {...props} icon="id-card" />}
        />

        <List.Item
          title="Username"
          description={currentUser.username}
          left={(props) => <List.Icon {...props} icon="account-circle" />}
        />
      </View>

      <Button onPress={onSignOut} mode="contained" style={styles.button}>
        Log Out
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 9,
  },
  spinnerTextStyle: {
    color: '#FFFFF',
  },
})

export default Profile
