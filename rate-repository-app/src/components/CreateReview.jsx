import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Text, Button } from 'react-native-paper'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-native'
import { Formik, useField } from 'formik'
import * as yup from 'yup'
import Spinner from 'react-native-loading-spinner-overlay'

import { CREATE_REVIEW } from '../graphql/mutations'
import {
  REPOSITORIES,
  REPOSITORY,
  ME,
  REVIEWS,
  REVIEW,
} from '../graphql/queries'

const initialValues = {
  repositoryIdentification: '',
  rating: 0,
  reviewText: '',
}

const schema = yup.object().shape({
  repositoryIdentification: yup.string().required(),
  rating: yup.number().required().positive().integer(),
  reviewText: yup.string().min(7).required('Review field is required!'),
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

const CreateReviewForm = ({ onSubmit }) => {
  return (
    <View>
      <FormikTextInput name="repositoryIdentification" style={styles.input} />
      <FormikTextInput
        name="rating"
        placeholder="Enter rating"
        style={styles.input}
        keyboardType="numeric"
      />
      <FormikTextInput
        name="reviewText"
        placeholder="Enter review"
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

const CreateReview = ({ mounted, setErrorMessage }) => {
  const [addReview, { loading, error, data }] = useMutation(CREATE_REVIEW, {
    refetchQueries: [
      { query: ME },
      { query: REPOSITORIES },
      { query: REPOSITORY },
      { query: REVIEWS },
      { query: REVIEW },
    ],
  })

  const navigate = useNavigate()

  React.useEffect(() => {
    const prepare = async () => {
      try {
        if (mounted && data?.createReview) {
          navigate('/')
          await new Promise((resolve) => setTimeout(resolve, 5000))
        }
      } catch (error) {
        setErrorMessage(error)
        navigate('/create-review')
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
        navigate('/create-repository')
        clearTimeout(timer)
      }, 9000)
    }
  }, [error, mounted, navigate, setErrorMessage])

  const onSubmit = async (values, { resetForm, setStatus }) => {
    const { repositoryIdentification, rating, reviewText } = values
    try {
      setStatus({ success: true })
      addReview({
        variables: {
          repositoryIdentification,
          rating,
          reviewText,
        },
        update: (cache, { data: { addReview } }) => {
          const data = cache.readQuery({ query: REPOSITORIES })
          data.repositories = [...data.repositories, addReview]
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
        Create Review
      </Text>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({ handleSubmit }) => <CreateReviewForm onSubmit={handleSubmit} />}
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

export default CreateReview
