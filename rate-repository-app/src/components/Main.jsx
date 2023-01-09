import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Routes, Route, Navigate } from 'react-router-native'

import AppBar from './AppBar'
import BottomNav from './BottomNav'
import RepositoryList from './RepositoryList'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Notification from './Notification'
import Profile from './Profile'

const Main = () => {
  const [successMessage, setSuccessMessage] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  const isComponentMounted = React.useRef(true)

  React.useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  return (
    <SafeAreaView>
      <AppBar />
      <Notification error={errorMessage} success={successMessage} />
      <View style={styles.container}>
        <Routes>
          <Route path="/" element={<RepositoryList />} />
          <Route
            path="/signup"
            element={
              <SignUp
                mounted={isComponentMounted}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
              />
            }
          />
          <Route
            path="/signin"
            element={
              <SignIn
                mounted={isComponentMounted}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                mounted={isComponentMounted}
                setErrorMessage={setErrorMessage}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </View>
      <BottomNav />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    flexShrink: 1,
    padding: 20,
    minHeight: 643,
    backgroundColor: '#FFFFFF',
  },
})

export default Main
