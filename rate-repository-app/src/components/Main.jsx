import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Routes, Route, Navigate } from 'react-router-native'

import AppBar from './AppBar'
import RepositoryList from './RepositoryList'
import SignIn from './SignIn'
import SignUp from './SignUp'

const Main = () => {
  return (
    <SafeAreaView>
      <AppBar />
      <View style={styles.container}>
        <Routes>
          <Route path="/" element={<RepositoryList />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    flexShrink: 1,
    padding: 20,
    minHeight: 1000,
    backgroundColor: '#F7FBFB',
  },
})

export default Main
