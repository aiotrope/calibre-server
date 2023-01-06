import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View } from 'react-native'
import AppBar from './AppBar'
import Text from './Text'

const Main = () => {
  return (
    <SafeAreaView>
      <AppBar />
      <View style={styles.body}>
        <Text color="textSecondary">Hello World</Text>
        <Text color="textSecondary">Hello World</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 0,
    padding: 20,
    minHeight: 1000,
    backgroundColor: '#F7FBFB',
  },
})

export default Main
