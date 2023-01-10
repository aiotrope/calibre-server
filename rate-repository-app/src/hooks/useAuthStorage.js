import * as React from 'react'
import AuthStorageContext from '../contexts/AuthContext'

const useAuthStorage = () => {
  const { token, setToken, me, setMe } = React.useContext(AuthStorageContext)
  return { token, setToken, me, setMe }
}

export default useAuthStorage
