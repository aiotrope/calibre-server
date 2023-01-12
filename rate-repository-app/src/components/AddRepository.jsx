import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Text, Button } from 'react-native-paper'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-native'
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

const initialValues = {
  fullName: '',
  description: '',
  language: '',
  forksCount: 0,
  stargazersCount: 0,
  ownerAvatarUrl: '',
}

const schema = yup.object().shape({
  fullName: yup
    .string()
    .min(5, 'Minimum of 5 characters required!')
    .required('Username is required!'),
  description: yup
    .string()
    .min(5, 'Minimum of 3 characters required!')
    .required('Password is required!'),
  language: yup
    .string()
    .min(2, 'Minimum of 3 characters required!')
    .required('Password confirmation is required!'),
  forksCount: yup.number().required().positive().integer(),
  stargazersCount: yup.number().required().positive().integer(),
  ownerAvatarUrl: yup
    .string()
    .min(5, 'Minimum of 3 characters required!')
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

const AddRepositoryForm = ({ onSubmit }) => {
  return (
    <View>
      <FormikTextInput
        name="fullName"
        placeholder="Enter full name"
        style={styles.input}
      />
      <FormikTextInput
        name="description"
        placeholder="Enter description"
        style={styles.input}
      />
      <FormikTextInput
        name="language"
        placeholder="Enter language"
        style={styles.input}
      />
      <FormikTextInput
        name="forksCount"
        placeholder="Enter forks count"
        style={styles.input}
        keyboardType="numeric"
      />
      <FormikTextInput
        name="stargazersCount"
        placeholder="Enter stargazer count"
        style={styles.input}
        keyboardType="numeric"
      />
      <FormikTextInput
        name="ownerAvatarUrl"
        placeholder="Enter avatar url"
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

const AddRepository = ({ mounted, setErrorMessage }) => {
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

  const navigate = useNavigate()

  React.useEffect(() => {
    const prepare = async () => {
      try {
        if (mounted && data?.signup) {
          navigate('/')
          await new Promise((resolve) => setTimeout(resolve, 5000))
        }
      } catch (error) {
        setErrorMessage(error)
        navigate('/add-repository')
        await new Promise((resolve) => setTimeout(resolve, 8000))
        setErrorMessage(error)
      }
    }
    prepare()
  }, [mounted, data?.createRepository])

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
    const {
      fullName,
      description,
      language,
      forksCount,
      stargazersCount,
      ownerAvatarUrl,
    } = values
    try {
      setStatus({ success: true })
      addRepository({
        variables: {
          repositoryInput: {
            fullName,
            description,
            language,
            forksCount,
            stargazersCount,
            ownerAvatarUrl,
          },
        },
        update: (cache, { data: { addRepository } }) => {
          const data = cache.readQuery({ query: REPOSITORIES })
          data.repositories = [...data.repositories, addRepository]
          cache.writeQuery({ query: REPOSITORIES }, data)
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
        textContent={'Logging in...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
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
