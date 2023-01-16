import * as React from 'react'

export const GeneralContext = React.createContext()

export const GeneralProvider = ({ children }) => {
  const [successMessage, setSuccessMessage] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const isComponentMounted = React.useRef(true)

  React.useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  const mounted = isComponentMounted

  const value = {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    mounted,
  }

  return (
    <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>
  )
}

export const useGeneral = () => {
  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    mounted,
  } = React.useContext(GeneralContext)
  return {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    mounted,
  }
}
