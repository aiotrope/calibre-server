import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Text, Card, Avatar, Divider } from 'react-native-paper'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import { Link, useNavigate, Navigate } from 'react-router-native'
import pkg from 'lodash'
import numbro from 'numbro'
import moment from 'moment/moment'

import { useAuthStorage } from '../contexts/AuthContext'
import { REPOSITORIES } from '../graphql/queries'

const { cloneDeep, orderBy } = pkg

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

const MemoItem = React.memo(Item)

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

  const sorted = orderBy(repos, ['createdAt'], ['desc'])
  const renderItem = ({ item }) => (
    <MemoItem
      id={item.id}
      title={item.title}
      description={item.description}
      avatarUrl={item.avatarUrl}
      reviewCount={item.reviewCount}
      ratingAverage={item.ratingAverage}
      url={item.url}
      language={item.language}
      forksCount={item.forksCount}
      stargazersCount={item.stargazersCount}
      createdAt={item.createdAt}
    />
  )
  return (
    <View style={styles.mainContainer}>
      {token !== null ? (
        <FlatList
          data={sorted}
          initialNumToRender={3}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
