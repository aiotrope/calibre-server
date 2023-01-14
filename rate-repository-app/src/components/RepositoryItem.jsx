import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { List, Button } from 'react-native-paper'
import { useParams, useNavigate } from 'react-router-native'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'

import { REPOSITORY } from '../graphql/queries'
import { useAuthStorage } from '../contexts/AuthContext'
//import CreateReview from './CreateReview'

const RepositoryItem = ({ mounted, setErrorMessage }) => {
  const params = useParams()
  const navigate = useNavigate()
  const { setParamsId, setReviewName } = useAuthStorage()

  const { loading, error, data } = useQuery(REPOSITORY, {
    variables: { repositoryId: params.id },
  })

  React.useEffect(() => {
    const prepareError = async () => {
      if (mounted && error) {
        setErrorMessage(error.message)
        navigate(`/${params.id}`)
        await new Promise((resolve) => setTimeout(resolve, 8000))
      }
    }
    prepareError()
  }, [])

  const onReview = () => {
    navigate('/create-review')
    setParamsId(params.id)
    setReviewName(data?.repository?.repositoryName)
  }

  if (loading) {
    return (
      <Spinner
        visible={true}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  return (
    <View key={data?.repository?.id}>
      <List.Item
        title="Full Name"
        description={data?.repository?.fullName}
        left={(props) => <List.Icon {...props} icon="id-card" />}
      />
      <List.Item
        title="Description"
        description={data?.repository?.description}
        left={(props) => <List.Icon {...props} icon="id-card" />}
      />
      <List.Item
        title="Fork"
        description={data?.repository?.forksCount}
        left={(props) => <List.Icon {...props} icon="id-card" />}
      />

      <List.Item
        title="Language"
        description={data?.repository?.language}
        left={(props) => <List.Icon {...props} icon="id-card" />}
      />
      <List.Item
        title="Avatar"
        description={data?.repository?.avatarUrl}
        left={(props) => <List.Icon {...props} icon="id-card" />}
      />
      <Button mode="outlined" onPress={onReview}>
        Create a review
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFFFF',
  },
})

export default RepositoryItem
