import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Card, Avatar, Divider } from 'react-native-paper'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import { Link } from 'react-router-native'
import pkg from 'lodash'

import { useAuthStorage } from '../contexts/AuthContext'
import { REPOSITORIES } from '../graphql/queries'

const { orderBy } = pkg

const RepositoryList = ({ mounted, setErrorMessage }) => {
  const { token } = useAuthStorage()
  const { loading, error, data } = useQuery(REPOSITORIES)

  React.useEffect(() => {
    if (mounted && error) {
      setErrorMessage(error?.message)
      let timer
      timer = setTimeout(() => {
        setErrorMessage('')
        clearTimeout(timer)
      }, 9000)
    }
  }, [error, mounted, setErrorMessage])

  if (loading) {
    return (
      <Spinner
        visible={true}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  if (token === null) {
    return (
      <View>
        <Text>Repository List</Text>
      </View>
    )
  }
  const sorted = orderBy(data?.repositories, ['ratingAverage'], ['desc'])

  return (
    <>
      {sorted.map((repo, index) => (
        <>
          <ScrollView key={index}>
            <Link to={`/${repo?.id}`} underlayColor="none">
              <Card key={repo.id} style={styles.cardContainer} mode='none'>
                <Card.Content>
                  <Avatar.Image
                    size={30}
                    source={{ uri: repo.ownerAvatarUrl }}
                  />
                  <Text>{repo.fullName}</Text>
                  <Text>{repo.description}</Text>
                  <Text>{repo.ratingAverage}</Text>
                  <Text>{repo.ownerAvatarUrl}</Text>
                </Card.Content>
              </Card>
            </Link>
            <Divider style={{ height: 8 }} />
          </ScrollView>
          
        </>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 40,
    backgroundColor: '#FFF'
  },

  spinnerTextStyle: {
    color: '#FFFFF',
  },
  separator: {
    height: 10,
  },
})

export default RepositoryList
