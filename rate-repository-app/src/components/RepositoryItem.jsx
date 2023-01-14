import * as React from 'react'
import { View, StyleSheet, Linking, Alert } from 'react-native'
import { Button, Text, Card, Avatar } from 'react-native-paper'
import { useParams, useNavigate, Link } from 'react-router-native'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import numbro from 'numbro'
import moment from 'moment/moment'

import { REPOSITORY } from '../graphql/queries'
import { useAuthStorage } from '../contexts/AuthContext'

const Item = ({
  id,
  avatarUrl,
  fullName,
  description,
  url,
  language,
  ratingAverage,
  reviewCount,
  forksCount,
  stargazersCount,
  createdAt,
}) => {
  const forks = numbro(forksCount).format({ average: true, mantissa: 1 })
  const stars = numbro(stargazersCount).format({ average: true, mantissa: 1 })
  const rating = numbro(ratingAverage).format({ average: true })
  const created = moment(createdAt).format('DD.MM.YYYY')
  return (
    <View style={styles.container}>
      <Card key={id} style={styles.cardContainer}>
        <Link to={`/${id}`} underlayColor="none">
          <Card.Content>
            <Avatar.Image
              size={50}
              source={{ uri: avatarUrl }}
              style={{ backgroundColor: '#FFF' }}
            />
            <Text>{fullName}</Text>
            <Text>{description}</Text>
            <Text>{url}</Text>
            <Text>{language}</Text>
            <Text>{rating}</Text>
            <Text>{reviewCount}</Text>
            <Text>{forks}</Text>
            <Text>{stars}</Text>
            <Text>{created}</Text>
          </Card.Content>
        </Link>
      </Card>
    </View>
  )
}

React.memo(Item)

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
    <Button mode="outlined" onPress={handlePress}>
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
  const forks = numbro(data?.repository?.forksCount).format({ average: true, mantissa: 1 })
  const stars = numbro(data?.repository?.stargazersCount).format({ average: true, mantissa: 1 })
  const rating = numbro(data?.repository?.ratingAverage).format({ average: true })
  const created = moment(data?.repository?.createdAt).format('DD.MM.YYYY')
  const reviewCount = numbro(data?.repository?.reviewCount).format({ average: true })
  return (
    <View key={data?.repository?.id}>
      <Card style={styles.cardContainer}>
        <Card.Content>
          <Avatar.Image
            size={50}
            source={{ uri: data?.repository?.avatarUrl }}
            style={{ backgroundColor: '#FFF' }}
          />
          <Text>{data?.repository?.fullName}</Text>
          <Text>{data?.repository?.description}</Text>
          <Text>{data?.repository?.url}</Text>
          <Text>{data?.repository?.language}</Text>
          <Text>{rating}</Text>
          <Text>{reviewCount}</Text>
          <Text>{forks}</Text>
          <Text>{stars}</Text>
          <Text>{created}</Text>
          <URLButton url={data?.repository?.url} />

          <Link to={'/create-review'} underlayColor="none">
            <Text variant="bodyLarge">
              Create a review for {data?.repository?.fullName} repository
            </Text>
          </Link>
        </Card.Content>
      </Card>
      <Button mode="outlined" onPress={onReview}>
        Create a review
      </Button>
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
