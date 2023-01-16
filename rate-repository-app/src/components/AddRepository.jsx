import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Text, Button } from 'react-native-paper'
import { useMutation } from '@apollo/client'
import { useNavigate, Redirect } from 'react-router-native'
import { Formik, useField } from 'formik'
import * as yup from 'yup'
import Spinner from 'react-native-loading-spinner-overlay'

import { CREATE_REPOSITORY } from '../graphql/mutations'
import {
  REPOSITORIES,
  REPOSITORY,
  ME,
  REVIEWS,
  REVIEW,
} from '../graphql/queries'
import { useGeneral } from '../contexts/GeneralContext'
import { useAuthStorage } from '../contexts/AuthContext'

const initialValues = {
  ownerName: '',
  repositoryName: '',
}

const schema = yup.object().shape({
  ownerName: yup
    .string()
    .min(2, 'Minimum of 2 characters required!')
    .required('Field is required!'),
  repositoryName: yup
    .string()
    .min(2, 'Minimum of 2 characters required!')
    .required('Field is required!'),
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

const AddRepositoryForm = ({ onSubmit }) => {
  return (
    <View>
      <FormikTextInput
        name="ownerName"
        placeholder="Name of owner"
        style={styles.input}
      />
      <FormikTextInput
        name="repositoryName"
        placeholder="Name of the repositories"
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

const AddRepository = () => {
  const [addRepository, { loading, error, data }] = useMutation(
    CREATE_REPOSITORY,
    {
      refetchQueries: [
        { query: ME },
        { query: REPOSITORIES },
        { query: REPOSITORY },
        { query: REVIEWS },
        { query: REVIEW },
      ],
    }
  )
  const { mounted, setErrorMessage, setSuccessMessage } = useGeneral()
  const { token } = useAuthStorage()

  const navigate = useNavigate()

  React.useEffect(() => {
    const prepare = async () => {
      try {
        if (mounted && data?.createRepository) {
          setSuccessMessage(
            `${data?.createRepository?.ownerName}/${data?.createRepository?.repositoryName} created`
          )
          navigate('/')
          await new Promise((resolve) => setTimeout(resolve, 2000))
        
        }
      } catch (error) {
        setErrorMessage(error)
        navigate('/add-repository')
        await new Promise((resolve) => setTimeout(resolve, 8000))
        setErrorMessage(error)
      } finally {
        setSuccessMessage('')
      }
    }
    prepare()
  }, [mounted, data?.createRepository, setSuccessMessage])

  React.useEffect(() => {
    if (mounted && error) {
      setErrorMessage(error?.message)
      let timer
      timer = setTimeout(() => {
        setErrorMessage('')
        navigate('/add-repository')
        clearTimeout(timer)
      }, 9000)
    }
  }, [error, mounted, navigate, setErrorMessage])

  const onSubmit = async (values, { resetForm, setStatus }) => {
    const { ownerName, repositoryName } = values
    try {
      setStatus({ success: true })
      addRepository({
        variables: {
          repositoryInput: {
            ownerName,
            repositoryName,
          },
        },
      })
      resetForm({ values: initialValues })
    } catch (error) {
      setStatus({ success: false })
    }
  }

  if (loading) {
    return (
      <Spinner
        visible={true}
        textContent={'Loading in...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  if (!token) {
    return <Redirect to="/signin" />
  }

  return (
    <View>
      <Text style={styles.container} variant="headlineSmall">
        Create Repository
      </Text>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({ handleSubmit }) => <AddRepositoryForm onSubmit={handleSubmit} />}
      </Formik>
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

export default AddRepository
