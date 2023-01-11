import React from 'react'
import { useNavigate } from 'react-router-native'
import { Appbar as TopBar } from 'react-native-paper'

import { useAuthStorage } from '../contexts/AuthContext'


const AppBar = () => {
  const { token } = useAuthStorage()
  const navigate = useNavigate()

  const _goBack = () => {
    navigate('/')
  }
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
        <TopBar.Header>
          <TopBar.BackAction onPress={_goBack} />
          <TopBar.Content title="Repositories" />
          <TopBar.Action icon="account" size={28} onPress={onProfile} />
        </TopBar.Header>
      ) : (
        <TopBar.Header>
           <TopBar.BackAction onPress={_goBack} />
          <TopBar.Content title="Calibre" />
          <TopBar.Action icon="login" size={28} onPress={onSignIn} />
        </TopBar.Header>
      )}
    </>
  )
}

export default AppBar
