import * as React from 'react'
import { StyleSheet, Linking, Alert, FlatList } from 'react-native'
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
import { useParams, useNavigate, Redirect } from 'react-router-native'
import { useQuery, useMutation } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import numbro from 'numbro'
import moment from 'moment/moment'
import pkg from 'lodash'

import {
  ME,
  REPOSITORIES,
  REPOSITORY,
  REVIEWS,
  REVIEW,
  USERS,
} from '../graphql/queries'
import { DELETE_REVIEW } from '../graphql/mutations'
import { useAuthStorage } from '../contexts/AuthContext'
import { useGeneral } from '../contexts/GeneralContext'

const { orderBy, map } = pkg

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
    <Button onPress={handlePress} mode="outlined">
      Open in Github
    </Button>
  )
}

const DeleteReviewButton = ({ id }) => {
  const [delete_review, { loading, error, data }] = useMutation(DELETE_REVIEW, {
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
  const { setErrorMessage, mounted } = useGeneral()
  const { paramsId } = useAuthStorage()

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
          navigate(`/${paramsId}`)
        }
      } catch (error) {
        console.error(error)
      }
    }
    prepare()
  }, [data?.deleteReview])

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
        textContent={'Deleting...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  return (
    <Button onPress={handleDeleteReview} mode="contained">
      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
        Delete your review
      </Text>
    </Button>
  )
}

const Item = ({ id, reviewText, rating, createdAt, user }) => {
  const rate = numbro(rating).format({ average: true })
  const created = moment(createdAt).format('DD.MM.YYYY')
  const username = user?.username
  const { userId } = useAuthStorage()

  return (
    <>
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
        <Card.Actions>
          {user?.id === userId ? <DeleteReviewButton id={id} /> : null}
        </Card.Actions>
      </Card>
    </>
  )
}

const MemoItem = React.memo(Item)

const Separator = () => <Divider bold="true" />

const RepositoryItem = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { setParamsId, setReviewName, token, userId } = useAuthStorage()

  const { loading, error, data } = useQuery(REPOSITORY, {
    variables: { repositoryId: params.id },
  })
  const { mounted, setErrorMessage } = useGeneral()

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

  const reviewerArr = map(reviewField, 'user.id')
  const reviewer = reviewerArr.includes(userId)

  const headerComponent = () => (
    <>
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
        </Card.Content>

        <Card.Actions>
          <URLButton url={data?.repository?.url} />
          {!reviewer ? (
            <Button onPress={onReview} mode="contained">
              Create a review
            </Button>
          ) : null}
        </Card.Actions>
      </Card>
    </>
  )

  if (!token) {
    return <Redirect to="/signin" />
  }
  return (
    <>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={headerComponent}
        data={sortReview}
        initialNumToRender={3}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        onEndReachedThreshold={0.5}
      />
    </>
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
})

export default RepositoryItem
