import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { useQuery } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import pkg from 'lodash'

import { useAuthStorage } from '../contexts/AuthContext'
//import { useAuthStorage } from '../hooks/useAuthStorage'
import { REPOSITORIES } from '../graphql/queries'

const { orderBy } = pkg

const Item = ({ fullName, description, ratingAverage, ownerAvatarUrl }) => (
  <View>
    <Text>{fullName}</Text>
    <Text>{description}</Text>
    <Text>{ratingAverage}</Text>
    <Text>{ownerAvatarUrl}</Text>
  </View>
)
const ItemSeparator = () => (
  <View style={styles.separator}>
    <Divider />
  </View>
)

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

  const renderItem = ({ item }) => (
    <>
      <Item
        fullName={item.fullName}
        description={item.description}
        ratingAverage={item.ratingAverage}
        ownerAvatarUrl={item.ownerAvatarUrl}
      />
      {/*  <Divider /> */}
    </>
  )

  return (
    <FlatList
      data={sorted}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
    />
  )
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFFFF',
  },
  separator: {
    marginTop: 5,
    marginBottom: 5
  },
})

export default RepositoryList
