import * as React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { useGeneral } from '../contexts/GeneralContext'

const Notification = () => {
  const { successMessage, errorMessage } = useGeneral()
  const success = successMessage
  const error = errorMessage
  return (
    <>
      <Text style={styles.title}></Text>
      {error ? (
        <Text style={styles.errorText} variant="titleSmall">
          {error}
        </Text>
      ) : null}
      {success ? (
        <Text style={styles.successText} variant="titleSmall">
          {success}
        </Text>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  successText: {
    color: '#80c783',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#fb6f92',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})

export default Notification
