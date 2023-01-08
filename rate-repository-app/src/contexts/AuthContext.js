import * as React from 'react'

export const AuthStorageContext = React.createContext()

export const AuthStorageProvider = ({ children }) => {
  const [token, setToken] = React.useState({})

  const value = {
    token,
    setToken,
  }

  return (
    <AuthStorageContext.Provider value={value}>
      {children}
    </AuthStorageContext.Provider>
  )
}
