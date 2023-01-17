import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import {
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context'

import AppBar from './AppBar'
import BottomNav from './BottomNav'
import Notification from './Notification'
import RoutesList from './Routes'

const Main = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} initialMetrics={initialWindowMetrics}>
      <View style={styles.container}>
        <AppBar />
        <Notification />
        <RoutesList />
        <BottomNav />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    width: '100%',
  }
})

export default Main
