import { Text as NativeText, StyleSheet, Platform } from 'react-native'
import theme from '../theme'

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: Platform.OS === 'ios' ? theme.fonts.ios : theme.fonts.android,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  colorTextNeutral: {
    color: theme.colors.neutral,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontSizeTitle: {
    fontSize: theme.fontSizes.title,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
})

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    color === 'textNeutral' && styles.colorTextNeutral,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontSize === 'title' && styles.fontSizeTitle,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ]

  return <NativeText style={textStyle} {...props} />
}

export default Text
