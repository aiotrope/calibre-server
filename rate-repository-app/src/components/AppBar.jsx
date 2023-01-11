import React from 'react'
import { StyleSheet } from 'react-native'
import { useNavigate, Link } from 'react-router-native'
import { Appbar as TopBar, Text, Searchbar } from 'react-native-paper'

import { useAuthStorage } from '../contexts/AuthContext'

const AppBar = () => {
  const { token } = useAuthStorage()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (token === null) {
      navigate('/signin')
    }
  }, [token])

  return (
    <>
      {token !== null ? (
        <>
          <TopBar style={styles.topNav}>
            <Link to={'/'} underlayColor="none">
              <Text variant="titleMedium" style={styles.text}>
                Repositories
              </Text>
            </Link>

            <Link to={'/'} underlayColor="none">
              <Text variant="titleMedium" style={styles.middleText}>
                Create a review
              </Text>
            </Link>

            <Link to={'/profile'} underlayColor="none">
              <Text variant="titleMedium" style={styles.text}>
                Profile
              </Text>
            </Link>
          </TopBar>
          <Searchbar placeholder="Search" />
        </>
      ) : (
        <>
          <TopBar style={styles.topNav}>
            <Text variant="titleLarge" style={[styles.text, styles.title]}>
              Calibre
            </Text>

            <Link to={'/signin'} underlayColor="none">
              <Text variant="titleMedium" style={styles.text}>
                Sign In
              </Text>
            </Link>
          </TopBar>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  topNav: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    paddingRight: 50,
  },
  text: {
    fontWeight: 'bold',
  },
  middleText: {
    fontWeight: 'bold',
    paddingLeft: 12,
    paddingRight: 12,
  },
})

export default AppBar
