import { useState } from 'react'
import { Text, TextInput, Pressable, View } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import RepositoryList from '../components/RepositoryList'

describe('RepositoryList', () => {
  test('renders repository list', () => {
    const tree = renderer.create(<RepositoryList />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
