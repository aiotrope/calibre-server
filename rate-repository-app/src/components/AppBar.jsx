import React from 'react'
import { StyleSheet } from 'react-native'
import { useNavigate, Link } from 'react-router-native'
import { Appbar as TopBar, Text, Searchbar, List } from 'react-native-paper'

import { useAuthStorage } from '../contexts/AuthContext'

const AppBar = () => {
  const { token, setSorting, search, setSearch } = useAuthStorage()

  const navigate = useNavigate()
  const [expanded, setExpanded] = React.useState(true)
  const [accordionTitle, setAccordionTitle] = React.useState(
    'Latest repositories'
  )

  const onChangeSearch = (query) => {
    setSearch(query)
  }

  const handlePress = () => setExpanded(!expanded)

  React.useEffect(() => {
    if (token === null) {
      navigate('/signin')
    }
  }, [token])

  React.useEffect(() => {
    const prepare = async () => {
      if (accordionTitle === 'Lowest rated repositories') {
        setSorting('LOW')
      }
      if (accordionTitle === 'Latest repositories') {
        setSorting('latest')
      }
      if (accordionTitle === 'Highest rated repositories') {
        setSorting('highest')
      }
    }
    prepare()
  }, [accordionTitle, setSorting])

  return (
    <>
      {token !== null ? (
        <>
          <TopBar style={styles.topNav}>
            <Link to={'/'} underlayColor="none">
              <Text variant="titleMedium" style={styles.text}>
                Repositories
              </Text>
            </Link>

            <Link to={'/add-repository'} underlayColor="none">
              <Text variant="titleMedium" style={styles.middleText}>
                Create a repository
              </Text>
            </Link>
            <Link to={'/profile'} underlayColor="none">
              <Text variant="titleMedium" style={styles.text}>
                Profile
              </Text>
            </Link>
          </TopBar>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={search}
            style={{ textTransform: 'lowercase' }}
          />
          <List.Section>
            <List.Accordion title={accordionTitle} onPress={handlePress}>
              <List.Item
                title="Latest repositories"
                onPress={() => setAccordionTitle('Latest repositories')}
              />
              <List.Item
                title="Highest rated repositories"
                onPress={() => setAccordionTitle('Highest rated repositories')}
              />
              <List.Item
                title="Lowest rated repositories"
                onPress={() => setAccordionTitle('Lowest rated repositories')}
              />
            </List.Accordion>
          </List.Section>
        </>
      ) : (
        <>
          <TopBar style={styles.topNav}>
            <Link to={'/'} underlayColor="none">
              <Text variant="titleLarge" style={[styles.text, styles.title]}>
                Calibre
              </Text>
            </Link>
            <Link to={'/signin'} underlayColor="none">
              <Text variant="titleMedium" style={styles.middleText}>
                Sign In
              </Text>
            </Link>
            <Link to={'/signup'} underlayColor="none">
              <Text variant="titleMedium" style={styles.text}>
                Sign Up
              </Text>
            </Link>
          </TopBar>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  topNav: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    paddingRight: 40,
  },
  text: {
    fontWeight: 'bold',
  },
  middleText: {
    fontWeight: 'bold',
    paddingLeft: 12,
    paddingRight: 12,
  },
})

export default AppBar
