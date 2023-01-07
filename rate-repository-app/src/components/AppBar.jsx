import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Link } from 'react-router-native'

import Text from './Text'

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Link to="/" underlayColor="none">
        <Text fontWeight="bold" color="textPrimary" fontSize="title">
          Repositories
        </Text>
      </Link>
      <Link
        to="/signin"
        style={styles.login}
        underlayColor="none"
      >
        <Text style={styles.button} fontWeight="bold" color="texSecondary">
          Sign In
        </Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: '#EDF2FA',
    borderBottomWidth: 5,
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
  },
  login: {
    paddingLeft: 100,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#EDF2FA',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
})

export default AppBar
