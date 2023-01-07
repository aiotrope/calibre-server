import React from 'react'
import { View } from 'react-native'
import { Link } from 'react-router-native'
import Text from './Text'

const SignIn = () => {
  return (
    <View>
      <Text>Sign-in form</Text>
      <Link to={'/signup'} underlayColor="none">
        <Text>Need an account</Text>
      </Link>
    </View>
  )
}

export default SignIn
