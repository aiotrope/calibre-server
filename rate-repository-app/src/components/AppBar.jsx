import React from 'react'
import { useNavigate } from 'react-router-native'
import { useApolloClient } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appbar as TopNav } from 'react-native-paper'

import { AuthStorageContext } from '../contexts/AuthContext'

const AppBar = () => {
  const { token, setToken } = React.useContext(AuthStorageContext)
  const client = useApolloClient()
  const navigate = useNavigate()

  const onSignIn = () => {
    navigate('/signin')
  }

  React.useEffect(() => {
    if (token === null || Object.keys(token).length === 0) {
      navigate('/signin')
    }
  }, [token])

  const onSignOut = async () => {
    try {
      client.resetStore()
      setToken(null)
      await AsyncStorage.removeItem('auth')
      const accessToken = await AsyncStorage.getItem('auth')
      if (accessToken === null && token === null) {
        navigate('/signin')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {token !== null && Object.keys(token).length !== 0 ? (
        <TopNav.Header>
          <TopNav.Content title="Repositories" />
          <TopNav.Action icon="logout" size={28} onPress={onSignOut} />
        </TopNav.Header>
      ) : (
        <TopNav.Header>
          <TopNav.Content title="Calibre" />
          <TopNav.Action icon="login" size={28} onPress={onSignIn} />
        </TopNav.Header>
      )}
    </>
  )
}

export default AppBar
