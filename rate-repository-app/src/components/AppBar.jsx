import { View, StyleSheet } from 'react-native'
//import { SafeAreaView } from 'react-native-safe-area-context'
//import Constants from 'expo-constants'

import Text from './Text'

const AppBar = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text fontWeight="bold" color="texSecondary" fontSize="subheading">
          Repositories
        </Text>
      </View>
      <View style={styles.login}>
        <Text style={styles.button}>
          Login
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: '#EDF2FA',
    borderBottomWidth: 5,
    display: 'flex',
    flexDirection: 'row'
  },
  login: {
    paddingLeft: 145
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "#EDF2FA",
    alignSelf: "flex-start",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "48%",
    textAlign: "center",
  }
})

export default AppBar
