import * as React from 'react'

export const AuthStorageContext = React.createContext()

export const AuthStorageProvider = ({ children }) => {
  const [token, setToken] = React.useState(null)
  const [me, setMe] = React.useState(null)
  const [repos, setRepos] = React.useState([])

  const value = {
    token,
    setToken,
    me,
    setMe,
    repos,
    setRepos,
  }

  return (
    <AuthStorageContext.Provider value={value}>
      {children}
    </AuthStorageContext.Provider>
  )
}

export const useAuthStorage = () => {
  const { token, setToken, me, setMe, repos, setRepos } =
    React.useContext(AuthStorageContext)
  return { token, setToken, me, setMe, repos, setRepos }
}
