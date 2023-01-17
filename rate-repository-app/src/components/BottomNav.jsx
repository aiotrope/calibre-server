import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Appbar as Bottombar, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigate } from 'react-router-native'

const BOTTOM_Bottombar_HEIGHT = 60

const BottomNav = () => {
  const { bottom } = useSafeAreaInsets()
  const theme = useTheme()

  const navigate = useNavigate()
  const onPress = () => {
    navigate('/')
  }

  return (
    <>
    <View style={{ marginTop: 80 }}></View>
      <Bottombar
        style={[
          styles.bottom,
          {
            height: BOTTOM_Bottombar_HEIGHT + bottom,
            backgroundColor: theme.colors.elevation.level2,
          },
        ]}
        safeAreaInsets={{ bottom }}
      >
        <Bottombar.Action icon="home" onPress={onPress} />
      </Bottombar>
    </>
  )
}

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: 120,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
})

export default BottomNav
