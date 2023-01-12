import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useMutation, useApolloClient } from '@apollo/client'
import { Text, TextInput, Button } from 'react-native-paper'
import { Link, useNavigate } from 'react-router-native'
import { Formik, useField } from 'formik'
import * as yup from 'yup'
import Spinner from 'react-native-loading-spinner-overlay'

import { SIGNUP } from '../graphql/mutations'

const initialValues = {
  username: '',
  password: '',
  password_confirmation: ''
}
const schema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Minimum of 5 characters required!')
    .required('Username is required!'),
  password: yup
    .string()
    .min(3, 'Minimum of 3 characters required!')
    .required('Password is required!'),
  password_confirmation: yup
    .string()
    .min(3, 'Minimum of 3 characters required!')
    .when('password', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup.string().oneOf([yup.ref('password')], 'Confirm your password!'),
    })
    .required('Password confirmation is required!'),
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

const SignUpForm = ({ onSubmit }) => {
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
      <FormikTextInput
        name="password_confirmation"
        placeholder="Repeat your password"
        secureTextEntry={true}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={onSubmit} mode="elevated" style={styles.button}>
          Submit
        </Button>
      </View>
    </View>
  )
}

const SignUp = ({ mounted, setErrorMessage, setSuccessMessage }) => {
  const [createUser, { loading, error, data }] = useMutation(SIGNUP)
  const client = useApolloClient()
  const navigate = useNavigate()

  React.useEffect(() => {
    const prepare = async () => {
      try {
        if (mounted && data?.signup) {
          navigate('/signin')
          setSuccessMessage(data?.signup?.successSignupMessage)
          await new Promise((resolve) => setTimeout(resolve, 5000))
        }
      } catch (error) {
        //console.log(error)
        setErrorMessage(error)
        navigate('/signup')
        await new Promise((resolve) => setTimeout(resolve, 8000))
        setErrorMessage('')
      } finally {
        setSuccessMessage('')
        await client.resetStore()
      }
    }
    prepare()
  }, [data?.signup, mounted])

  React.useEffect(() => {
    if (mounted && error) {
      setErrorMessage(error?.message)
      let timer
      timer = setTimeout(() => {
        setErrorMessage('')
        navigate('/signup')
        clearTimeout(timer)
      }, 9000)
    }
  }, [error, mounted, navigate, setErrorMessage])

  const onSubmit = async (values, { resetForm, setStatus }) => {
    const { username, password } = values
    try {
      setStatus({ success: true })
      createUser({ variables: { username, password } })
      resetForm({ values: initialValues })
    } catch (error) {
      setStatus({ success: false })
    }
  }

  if (loading) {
    return (
      <Spinner
        visible={true}
        textContent={'Submitting...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  return (
    <View>
      <Text style={styles.container} variant="headlineSmall">
        Register an account
      </Text>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({ handleSubmit }) => <SignUpForm onSubmit={handleSubmit} />}
      </Formik>
      <View style={{ marginTop: 20 }}>
        <Link to={'/signin'} underlayColor="none">
          <Text style={{ textAlign: 'center' }} variant="bodyLarge">
            Already have an account?
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

export default SignUp
