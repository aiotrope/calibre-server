import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-native'

import RepositoryList from './RepositoryList'
import RepositoryItem from './RepositoryItem'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Profile from './Profile'
import AddRepository from './AddRepository'
import CreateReview from './CreateReview'
import NotFound from './NotFound'
import { useAuthStorage } from '../contexts/AuthContext'

const RoutesList = () => {
  const { token } = useAuthStorage()
  return (
    <Routes>
      <Route
        path="/"
        element={token ? <RepositoryList /> : <Navigate to={'/signin'} />}
      />
      <Route
        path="/:id"
        element={token ? <RepositoryItem /> : <Navigate to={'/signin'} />}
      />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/signin"
        element={!token ? <SignIn /> : <Navigate to={'/'} />}
      />
      <Route
        path="/profile"
        element={token ? <Profile /> : <Navigate to={'/signin'} />}
      />
      <Route
        path="/add-repository"
        element={token ? <AddRepository /> : <Navigate to={'/signin'} />}
      />
      <Route
        path="/create-review"
        element={token ? <CreateReview /> : <Navigate to={'/signin'} />}
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={token ? <Navigate to="/" /> : <NotFound />} />
    </Routes>
  )
}

export default RoutesList
