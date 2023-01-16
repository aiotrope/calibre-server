import * as React from 'react'
import { View, StyleSheet, FlatList, Linking, Alert } from 'react-native'
import { Text, Button, Card, Badge, Divider } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApolloClient, useQuery, useMutation } from '@apollo/client'
import { Navigate, useNavigate } from 'react-router-native'
import Spinner from 'react-native-loading-spinner-overlay'
import numbro from 'numbro'
import moment from 'moment/moment'
import pkg from 'lodash'

import { useAuthStorage } from '../contexts/AuthContext'
import {
  ME,
  REPOSITORIES,
  REPOSITORY,
  REVIEWS,
  REVIEW,
  USERS,
} from '../graphql/queries'
import { DELETE_REVIEW } from '../graphql/mutations'

const { orderBy } = pkg

const URLButton = ({ url }) => {
  const handlePress = React.useCallback(async () => {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert(`Can't open this URL: ${url}`)
    }
  }, [url])

  return (
    <Button onPress={handlePress} mode="contained-tonal" style={{ marginRight: 9 }}>
      View Repository
    </Button>
  )
}

const DeleteButton = ({ id }) => {
  const [delete_review, { loading, data }] = useMutation(DELETE_REVIEW, {
    refetchQueries: [
      { query: ME },
      { query: REPOSITORIES },
      { query: REPOSITORY },
      { query: REVIEWS },
      { query: REVIEW },
      { query: USERS },
    ],
  })
  const navigate = useNavigate()

  const handleDeleteReview = async () => {
    try {
      delete_review({ variables: { reviewId: id } })
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    const prepare = async () => {
      try {
        if (data?.deleteReview) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          navigate('/profile')
        }
      } catch (error) {
        console.error(error)
      }
    }
    prepare()
  }, [data?.deleteReview])

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
    <Button onPress={handleDeleteReview} mode='contained'>
      Delete review
    </Button>
  )
}

const Item = ({ id, reviewText, rating, createdAt, repository }) => {
  const rate = numbro(rating).format({ average: true })
  const created = moment(createdAt).format('DD.MM.YYYY')
  const repo = repository.fullName
  const repoUrl = repository.url
  return (
    <View style={styles.container}>
      <Card key={id} style={styles.cardContainer}>
        <Card.Title
          title={repo}
          titleStyle={{ fontWeight: 'bold' }}
          subtitle={created}
          subtitleNumberOfLines={1000}
          left={() => (
            <Badge size={45} style={{ backgroundColor: '#003f5c' }}>
              {rate}
            </Badge>
          )}
        />
        <Card.Content>
          <Text>{reviewText}</Text>
        </Card.Content>
        <Card.Actions>
          <URLButton url={repoUrl} />
          <DeleteButton id={id} />
        </Card.Actions>
      </Card>
    </View>
  )
}

const MemoItem = React.memo(Item)

const Profile = ({ mounted, setErrorMessage }) => {
  const client = useApolloClient()
  const {
    token,
    setToken,
    setMe,
    setRepos,
    setParamsId,
    setReviewName,
    setSorting,
    setSearch,
  } = useAuthStorage()
  const { loading, error, data } = useQuery(ME)

  React.useEffect(() => {
    const setUser = async () => {
      try {
        if (mounted && token !== null) {
          setMe(data?.me)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      } catch (error) {
        console.error(error)
      }
    }
    setUser()
  }, [mounted, token, setMe])

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

  const onSignOut = async () => {
    try {
      await client.resetStore()
      setToken(null)
      setMe(null)
      setRepos([])
      setParamsId(null)
      setReviewName(null)
      setSorting('latest')
      setSearch(null)
      await AsyncStorage.removeItem('auth')
    } catch (error) {
      setErrorMessage(error)
      let timer
      timer = setTimeout(() => {
        setErrorMessage('')
        clearTimeout(timer)
      }, 9000)
    }
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

  if (token === null) return <Navigate to={'/signin'} />

  const currentUser = data?.me
  const reviewField = currentUser?.reviewsCreated
  const sortReview = orderBy(reviewField, ['createdAt'], ['desc'])

  const renderItem = ({ item }) => (
    <MemoItem
      id={item.id}
      repository={item.repository}
      reviewText={item.reviewText}
      rating={item.rating}
      created={item.createdAt}
    />
  )

  return (
    <View style={styles.mainContainer}>
      <FlatList
        ListHeaderComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <Button onPress={onSignOut} style={styles.button} mode="contained">
              Log Out
            </Button>
          </View>
        }
        data={sortReview}
        initialNumToRender={3}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
      />
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
  },
  cardContainer: {
    margin: 10,
    padding: 15,
  },

  spinnerTextStyle: {
    color: '#FFFFF',
  },
  button: {
    width: '85%',
  },
})

export default Profile
