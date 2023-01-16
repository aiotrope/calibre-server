import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import {
  Text,
  Card,
  Avatar,
  Divider,
  DataTable,
  Chip,
} from 'react-native-paper'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import { useNavigate, Navigate, Link } from 'react-router-native'
import pkg from 'lodash'
import numbro from 'numbro'

import { useAuthStorage } from '../contexts/AuthContext'
import { REPOSITORIES } from '../graphql/queries'

const { cloneDeep, orderBy } = pkg

const Item = ({
  id,
  avatarUrl,
  fullName,
  description,
  language,
  ratingAverage,
  reviewCount,
  forksCount,
  stargazersCount,
}) => {
  const forks = numbro(forksCount).format({ average: true, mantissa: 1 })
  const stars = numbro(stargazersCount).format({ average: true, mantissa: 1 })
  const rating = numbro(ratingAverage).format({ average: true })
  //const created = moment(createdAt).format('DD.MM.YYYY')
  const lang = `language-${lang}`.toLowerCase()

  return (
    <View style={styles.container}>
      <Card key={id} style={styles.cardContainer} mode="contained">
        <Card.Title
          title={fullName}
          titleStyle={{ fontWeight: 'bold' }}
          subtitle={`${description}`}
          subtitleNumberOfLines={10}
          left={(props) => (
            <Link to={`/${id}`} underlayColor="none">
              <Avatar.Image {...props} source={{ uri: avatarUrl }} />
            </Link>
          )}
        />

        <Card.Content>
          <View>
            <DataTable>
              <DataTable.Row style={{ marginTop: 5, marginLeft: 37 }}>
                <DataTable.Cell>
                  <Chip
                    icon={`language-${language}`.toLowerCase()}
                    style={{ backgroundColor: '#FFF' }}
                  >
                    {language}
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
      </Card>
    </View>
  )
}

const MemoItem = React.memo(Item)

const RepositoryList = ({ mounted, setErrorMessage }) => {
  const { token, repos, setRepos, sorting, search } = useAuthStorage()
  const { loading, error, data } = useQuery(REPOSITORIES, {
    variables: { searchKeyword: search },
  })
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

  let sorted
  if (sorting === 'latest') {
    sorted = orderBy(repos, ['createdAt'], ['desc'])
  }
  if (sorting === 'highest') {
    sorted = orderBy(repos, ['ratingAverage'], ['desc'])
  }

  if (sorting === 'lowest') {
    sorted = orderBy(repos, ['ratingAverage'], ['asc'])
  }

  const renderItem = ({ item }) => (
    <MemoItem
      id={item.id}
      fullName={item.fullName}
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
    margin: 7,
    padding: 7,
  },

  spinnerTextStyle: {
    color: '#FFFFF',
  },
  separator: {
    height: 10,
  },
})

export default RepositoryList
