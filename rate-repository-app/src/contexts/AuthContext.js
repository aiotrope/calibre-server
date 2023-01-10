import * as React from 'react'

export const AuthStorageContext = React.createContext()

export const AuthStorageProvider = ({ children }) => {
  const [token, setToken] = React.useState(null)
  const [me, setMe] = React.useState(null)

  const value = {
    token,
    setToken,
    me,
    setMe,
  }

  return (
    <AuthStorageContext.Provider value={value}>
      {children}
    </AuthStorageContext.Provider>
  )
}

export const useAuthStorage = () => {
  const { token, setToken, me, setMe } = React.useContext(AuthStorageContext)
  return { token, setToken, me, setMe }
}

