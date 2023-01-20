import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { Card, Avatar, Divider, DataTable, Chip } from 'react-native-paper'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import { useNavigate, Link, Redirect } from 'react-router-native'
import pkg from 'lodash'
import numbro from 'numbro'
import { useDebounce } from 'use-debounce'

import { useAuthStorage } from '../contexts/AuthContext'
import { useGeneral } from '../contexts/GeneralContext'
import { REPOSITORIES } from '../graphql/queries'

const { orderBy, cloneDeep, sortBy } = pkg

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
  const stars = numbro(stargazersCount).format({
    average: true,
    mantissa: 1,
  })
  const rating = numbro(ratingAverage).format({ average: true })

  return (
    <>
      <Card key={id} style={styles.cardContainer} mode="contained">
        <Link to={`/${id}`} underlayColor="none">
          <Card.Title
            title={fullName}
            titleStyle={{ fontWeight: 'bold' }}
            subtitle={`${description}`}
            subtitleNumberOfLines={10}
            left={(props) => (
              <Avatar.Image {...props} source={{ uri: avatarUrl }} />
            )}
          />
        </Link>
        <Card.Content>
          <DataTable>
            <DataTable.Row style={{ marginTop: 5, marginLeft: 37 }}>
              <DataTable.Cell>
                <Link to={`/${id}`} underlayColor="none">
                  <Chip
                    icon={`language-${language}`.toLowerCase()}
                    style={{ backgroundColor: '#FFF' }}
                  >
                    {language}
                  </Chip>
                </Link>
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
      </Card>
    </>
  )
}

const MemoItem = React.memo(Item)

const Separator = () => <Divider bold="true" />

const RepositoryList = () => {
  const { token, repos, setRepos, sorting, search } = useAuthStorage()
  const debounce = useDebounce(search, 500)
  const debounceValue = String(debounce[0])
  const { loading, error, refetch, data } = useQuery(REPOSITORIES, {
    variables: { searchKeyword: '', first: null, after: null },
  })

  const navigate = useNavigate()
  const { mounted, setErrorMessage } = useGeneral()

  React.useEffect(() => {
    const prepare = async () => {
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
    if (search !== '' && debounceValue !== undefined) {
      refetch({ searchKeyword: debounceValue })
    } else {
      refetch({ searchKeyword: '' })
    }
  }, [search, debounceValue])

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
  if (sorting === 'LOW') {
    sorted = sortBy(repos.edges, ['node.ratingAverage'])
  }

  if (sorting === 'latest') {
    sorted = orderBy(repos.edges, ['node.createdAt'], ['desc'])
  }

  if (sorting === 'highest') {
    sorted = orderBy(repos.edges, ['node.ratingAverage'], ['desc'])
  }

  const renderItem = ({ item }) => (
    <MemoItem
      id={item.node.id}
      fullName={item.node.fullName}
      description={item.node.description}
      avatarUrl={item.node.avatarUrl}
      reviewCount={item.node.reviewCount}
      ratingAverage={item.node.ratingAverage}
      url={item.node.url}
      language={item.node.language}
      forksCount={item.node.forksCount}
      stargazersCount={item.node.stargazersCount}
      createdAt={item.node.createdAt}
    />
  )

  if (!token) {
    return <Redirect to="/signin" />
  }
  return (
    <>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={sorted}
        initialNumToRender={2}
        keyExtractor={(item) => item.node.id}
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
    paddingVertical: 7,
  },

  spinnerTextStyle: {
    color: '#FFFFF',
  },
  separator: {
    height: 10,
  },
})

export default RepositoryList
