import * as React from 'react'
import { View, StyleSheet, FlatList, Linking, Alert } from 'react-native'
import { Text, Button, Card, Badge, Divider } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApolloClient, useQuery } from '@apollo/client'
import { Redirect, useNavigate } from 'react-router-native'
import Spinner from 'react-native-loading-spinner-overlay'
import numbro from 'numbro'
import moment from 'moment/moment'
import pkg from 'lodash'

import { useAuthStorage } from '../contexts/AuthContext'
import { useGeneral } from '../contexts/GeneralContext'
import { ME } from '../graphql/queries'

const { orderBy } = pkg

const Separator = () => <Divider bold="true" />

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
    <Button
      onPress={handlePress}
      mode="contained-tonal"
      style={{ marginRight: 9 }}
    >
      View Repository
    </Button>
  )
}

const Item = ({ id, reviewText, rating, createdAt, repository }) => {
  const rate = numbro(rating).format({ average: true })
  const created = moment(createdAt).format('DD.MM.YYYY')
  const repo = repository.fullName
  const repoUrl = repository.url
  const navigate = useNavigate()

  const onSingleReviewPage = () => {
    navigate(`/review/${id}`)
  }
  return (
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
        <Button onPress={onSingleReviewPage}>Delete review</Button>
      </Card.Actions>
    </Card>
  )
}

const MemoItem = React.memo(Item)

const Profile = () => {
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
    setUserId,
  } = useAuthStorage()
  const { loading, error, data } = useQuery(ME, {
    variables: {
      first: null,
      after: null,
      reviewsCreatedFirst2: null,
      reviewsCreatedAfter2: null,
    },
  })
  const { setErrorMessage, mounted } = useGeneral()

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
      setSearch('')
      setUserId(null)
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

  if (!token) return <Redirect to={'/signin'} />

  const currentUser = data?.me
  const reviewField = currentUser?.reviewsCreated?.edges
  const sortReview = orderBy(reviewField, ['node.createdAt'], ['desc'])

  const renderItem = ({ item }) => (
    <MemoItem
      id={item.node.id}
      repository={item.node.repository}
      reviewText={item.node.reviewText}
      rating={item.node.rating}
      created={item.node.createdAt}
    />
  )

  const headerComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
      }}
    >
      <Button onPress={onSignOut} style={styles.button} mode="contained-tonal">
        Log Out 
      </Button>
    </View>
  )

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      ListHeaderComponent={headerComponent}
      data={sortReview}
      initialNumToRender={2}
      keyExtractor={(item) => item.node.id}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      onEndReachedThreshold={0.5}
    />
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  spinnerTextStyle: {
    color: '#FFFFF',
  },
  separator: {
    height: 10,
  },
  button: {
    width: '85%',
    padding: 9,
  },
})

export default Profile
