import * as React from 'react'
import { View, StyleSheet, Linking, Alert, FlatList } from 'react-native'
import {
  Button,
  Card,
  Avatar,
  DataTable,
  Chip,
  Badge,
  Divider,
  Text,
} from 'react-native-paper'
import { useParams, useNavigate } from 'react-router-native'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import numbro from 'numbro'
import moment from 'moment/moment'
import pkg from 'lodash'

import { REPOSITORY } from '../graphql/queries'
import { useAuthStorage } from '../contexts/AuthContext'

const { orderBy } = pkg

const Item = ({ id, reviewText, rating, createdAt, user }) => {
  const rate = numbro(rating).format({ average: true })
  const created = moment(createdAt).format('DD.MM.YYYY')
  const username = user?.username
  return (
    <View style={styles.container}>
      <Card key={id} style={styles.cardContainer}>
        <Card.Title
          title={`Review by ${username}`}
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
      </Card>
    </View>
  )
}

const MemoItem = React.memo(Item)

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
    <Button onPress={handlePress} mode="contained">
      Open in Github
    </Button>
  )
}

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
  const forks = numbro(data?.repository?.forksCount).format({
    average: true,
    mantissa: 1,
  })
  const stars = numbro(data?.repository?.stargazersCount).format({
    average: true,
    mantissa: 1,
  })
  const rating = numbro(data?.repository?.ratingAverage).format({
    average: true,
  })

  const reviewCount = numbro(data?.repository?.reviewCount).format({
    average: true,
  })

  const reviewField = data?.repository?.reviews
  const sortReview = orderBy(reviewField, ['createdAt'], ['desc'])

  const renderItem = ({ item }) => (
    <MemoItem
      id={item.id}
      user={item.user}
      reviewText={item.reviewText}
      rating={item.rating}
      created={item.createdAt}
    />
  )
  return (
    <View>
      <Card
        key={data?.repository?.id}
        style={styles.cardContainer}
        mode="contained"
      >
        <Card.Title
          title={`${data?.repository?.fullName}`}
          titleStyle={{ fontWeight: 'bold' }}
          subtitle={data?.repository?.description}
          subtitleNumberOfLines={10}
          left={(props) => (
            <Avatar.Image
              {...props}
              source={{ uri: data?.repository?.avatarUrl }}
            />
          )}
        />

        <Card.Content>
          <View>
            <DataTable>
              <DataTable.Row style={{ marginTop: 5, marginLeft: 37 }}>
                <DataTable.Cell>
                  <Chip
                    icon={`language-${data?.repository?.language}`.toLowerCase()}
                    style={{ backgroundColor: '#FFF' }}
                  >
                    {data?.repository?.language}
                  </Chip>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>{stars}</DataTable.Cell>
                <DataTable.Cell>{forks}</DataTable.Cell>
                <DataTable.Cell>{reviewCount}</DataTable.Cell>
                <DataTable.Cell>{rating}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Stars</DataTable.Cell>
                <DataTable.Cell>Forks</DataTable.Cell>
                <DataTable.Cell>Reviews</DataTable.Cell>
                <DataTable.Cell>Rating</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>
        </Card.Content>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Card.Actions>
            <URLButton url={data?.repository?.url} />
            <Button onPress={onReview}>Create a review</Button>
          </Card.Actions>
        </View>
      </Card>
      <View style={styles.mainContainer}>
        <FlatList
          data={sortReview}
          initialNumToRender={3}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
      </View>
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
})

export default RepositoryItem
