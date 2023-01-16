import * as React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AppBar from './AppBar'
import BottomNav from './BottomNav'
import Notification from './Notification'
import RoutesList from './Routes'

const Main = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              <AppBar />
              <Notification />
              <RoutesList />
            </>
          }
        />
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
    backgroundColor: '#FFFFFF',
  },
  routesContainer: {
    flex: 1,
    width: '100%',
  },
})

export default Main
