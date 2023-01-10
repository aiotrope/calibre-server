import React from 'react'
import { useNavigate } from 'react-router-native'
import { Appbar as TopNav } from 'react-native-paper'

import { useAuthStorage } from '../contexts/AuthContext'


const AppBar = () => {
  const { token } = useAuthStorage()
  const navigate = useNavigate()
  const onSignIn = () => {
    navigate('/signin')
  }

  const onProfile = () => {
    navigate('/profile')
  }

  React.useEffect(() => {
    if (token === null) {
      navigate('/signin')
    }
  }, [token])

 
  return (
    <>
      {token !== null ? (
        <TopNav.Header>
          <TopNav.Content title="Repositories" />
          <TopNav.Action icon="account" size={28} onPress={onProfile} />
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
