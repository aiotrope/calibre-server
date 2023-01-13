import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Text, Card, Avatar, Divider } from 'react-native-paper'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import { Link, useNavigate, Navigate } from 'react-router-native'
import pkg from 'lodash'

import { useAuthStorage } from '../contexts/AuthContext'
import { REPOSITORIES } from '../graphql/queries'

const { cloneDeep, orderBy } = pkg

const RepositoryList = ({ mounted, setErrorMessage }) => {
  const { token, repos, setRepos } = useAuthStorage()
  const { loading, error, data } = useQuery(REPOSITORIES)
  const navigate = useNavigate()

  React.useEffect(() => {
    const prepare = async () => {
      if (mounted && !data?.repositories) return <Navigate to={'/signin'} />
      try {
        if (mounted && data?.repositories) {
          setRepos(cloneDeep(data?.repositories))
        }
      } catch (error) {
        setErrorMessage(error)
        await new Promise((resolve) => setTimeout(resolve, 4000))
        navigate('/')
        setErrorMessage('')
      }
    }
    prepare()
  }, [mounted, data?.repositories])

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

  const sorted = orderBy(repos, ['ratingAverage'], ['desc'])
  return (
    <View style={styles.mainContainer}>
      {token !== null ? (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Card key={item.id} style={styles.cardContainer}>
                <Link to={`/${item.id}`} underlayColor="none">
                  <Card.Content>
                    <Avatar.Image
                      size={50}
                      source={{ uri: item.avatarUrl }}
                      style={{ backgroundColor: '#FFF' }}
                    />
                    <Text>{item.fullName}</Text>
                    <Text>{item.description}</Text>
                    <Text>{item.url}</Text>
                    <Text>{item.language}</Text>
                    <Text>{item.ratingAverage}</Text>
                    <Text>{item.reviewCount}</Text>
                    <Text>{item.forksCount}</Text>
                    <Text>{item.stargazersCount}</Text>
                    <Text>{item.avatarUrl}</Text>
                    <Text>{item.forksCount}</Text>
                  </Card.Content>
                </Link>
              </Card>
            </View>
          )}
          ItemSeparatorComponent={Divider}
        />
      ) : (
        <Text>Repository List</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minHeight: 3000,
  },
  container: {
    flex: 1,
    margin: 10,
  },
  cardContainer: {
    margin: 10,
    padding: 15,
  },

  spinnerTextStyle: {
    color: '#FFFFF',
  },
  separator: {
    height: 10,
  },
})

export default RepositoryList
