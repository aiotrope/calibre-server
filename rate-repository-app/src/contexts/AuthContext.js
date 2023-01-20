import * as React from 'react'

export const AuthStorageContext = React.createContext()

export const AuthStorageProvider = ({ children }) => {
  const [token, setToken] = React.useState(null)
  const [me, setMe] = React.useState(null)
  const [userId, setUserId] = React.useState(null)
  const [repos, setRepos] = React.useState([])
  const [paramsId, setParamsId] = React.useState(null)
  const [reviewName, setReviewName] = React.useState(null)
  const [sorting, setSorting] = React.useState('latest')
  const [search, setSearch] = React.useState('')

  const value = {
    token,
    setToken,
    me,
    setMe,
    repos,
    setRepos,
    paramsId,
    setParamsId,
    reviewName,
    setReviewName,
    sorting,
    setSorting,
    search,
    setSearch,
    userId,
    setUserId,
  }

  return (
    <AuthStorageContext.Provider value={value}>
      {children}
    </AuthStorageContext.Provider>
  )
}

export const useAuthStorage = () => {
  const {
    token,
    setToken,
    me,
    setMe,
    repos,
    setRepos,
    paramsId,
    setParamsId,
    reviewName,
    setReviewName,
    sorting,
    setSorting,
    search,
    setSearch,
    userId,
    setUserId,
  } = React.useContext(AuthStorageContext)
  return {
    token,
    setToken,
    me,
    setMe,
    repos,
    setRepos,
    paramsId,
    setParamsId,
    reviewName,
    setReviewName,
    sorting,
    setSorting,
    search,
    setSearch,
    userId,
    setUserId,
  }
}
