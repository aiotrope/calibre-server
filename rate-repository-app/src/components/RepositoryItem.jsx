import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { List } from 'react-native-paper'
import { useParams, useNavigate } from 'react-router-native'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'

import { REPOSITORY } from '../graphql/queries'

const RepositoryItem = ({ mounted, setErrorMessage }) => {
  const params = useParams()
  const navigate = useNavigate()
  const { loading, error, data } = useQuery(REPOSITORY, {
    variables: { repositoryId: params.id },
  })

  /* React.useEffect(() => {
    const fetchRepo = async () => {
      try {
        if (mounted && data?.repository) {
          refetch({ repositoryId: params.id })
        }
      } catch (error) {
        setErrorMessage(error)
        await new Promise((resolve) => setTimeout(resolve, 8000))
      }
    }
    fetchRepo()
  }, [mounted, data?.repository, refetch]) */

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
        description={data?.repository?.ownerAvatarUrl}
        left={(props) => <List.Icon {...props} icon="id-card" />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFFFF',
  },
})

export default RepositoryItem
