import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useMutation, useApolloClient } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, TextInput, Button } from 'react-native-paper'
import { Link, useNavigate } from 'react-router-native'
import { Formik, useField } from 'formik'
import * as yup from 'yup'
import Spinner from 'react-native-loading-spinner-overlay'

import { LOGIN } from '../graphql/mutations'
import { ME, REPOSITORIES, REPOSITORY } from '../graphql/queries'
import { useAuthStorage } from '../contexts/AuthContext'
//import useAuthStorage from '../hooks/useAuthStorage'

const initialValues = {
  username: '',
  password: '',
}
const schema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Minimum of 5 characters')
    .required('Field is required'),
  password: yup
    .string()
    .min(3, 'Minimum of 3 characters')
    .required('Field is required'),
})

const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name)
  const showError = meta.touched && meta.error

  return (
    <>
      <TextInput
        onChangeText={(value) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        autoCapitalize="none"
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </>
  )
}

const SignInForm = ({ onSubmit }) => {
  return (
    <View>
      <FormikTextInput
        name="username"
        placeholder="Enter username"
        style={styles.input}
      />
      <FormikTextInput
        name="password"
        placeholder="Enter password"
        secureTextEntry={true}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={onSubmit} mode="elevated" style={styles.button}>
          Sign-in
        </Button>
      </View>
    </View>
  )
}

const SignIn = ({ mounted, setErrorMessage, setSuccessMessage }) => {
  const { setToken } = useAuthStorage()
  const [login, { loading, error, data }] = useMutation(LOGIN, {
    refetchQueries: [
      { query: ME },
      { query: REPOSITORIES },
      { query: REPOSITORY },
    ],
  })
  const client = useApolloClient()
  const navigate = useNavigate()

  React.useEffect(() => {
    const prepare = async () => {
      try {
        if (mounted && data?.login) {
          setSuccessMessage(data?.login?.successLoginMessage)
          const token = data?.login?.token
          await AsyncStorage.setItem('auth', token)
          const accessToken = await AsyncStorage.getItem('auth')
          if (accessToken !== null) {
            await new Promise((resolve) => setTimeout(resolve, 4000))
            navigate('/')
            setToken(accessToken)
            setSuccessMessage('')
          }
        }
      } catch (error) {
        setErrorMessage(error?.message)
        let timer
        timer = setTimeout(() => {
          setErrorMessage('')
          navigate('/signin')
          clearTimeout(timer)
        }, 8000)
      } finally {
        await client.resetStore()
      }
    }
    prepare()
  }, [data?.login, mounted])

  React.useEffect(() => {
    if (mounted && error) {
      setErrorMessage(error?.message)
      let timer
      timer = setTimeout(() => {
        setErrorMessage('')
        navigate('/signin')
        clearTimeout(timer)
      }, 9000)
    }
    if (
      mounted &&
      error?.message ===
        "Cannot read properties of null (reading 'passwordHash')"
    ) {
      setErrorMessage(
        'Wrong credentials! Check if you entered your username or password correctly'
      )
      let timer
      timer = setTimeout(() => {
        setErrorMessage('')
        navigate('/signin')
        clearTimeout(timer)
      }, 9000)
    }
  }, [error, mounted, navigate, setErrorMessage])

  const onSubmit = async (values, { resetForm, setStatus }) => {
    const { username, password } = values
    try {
      setStatus({ success: true })
      login({ variables: { username, password } })
      resetForm({ values: initialValues })
    } catch (error) {
      setStatus({ success: false })
    }
  }

  if (loading) {
    return (
      <Spinner
        visible={true}
        textContent={'Logging in...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  return (
    <View>
      <Text style={styles.container} variant="headlineSmall">
        Sign-in form
      </Text>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}
      </Formik>
      <View style={{ marginTop: 20 }}>
        <Link to={'/signup'} underlayColor="none">
          <Text style={{ textAlign: 'center' }} variant="bodyMedium">
            New to Calibre? Create an account.
          </Text>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
  },
  buttonContainer: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
  },
  button: {
    padding: 9,
  },
  input: {
    height: 50,
    margin: 15,
    padding: 10,
  },
  errorText: {
    margin: 5,
    color: 'red',
    paddingLeft: 15,
  },
  spinnerTextStyle: {
    color: '#FFFFF',
  },
})

export default SignIn
