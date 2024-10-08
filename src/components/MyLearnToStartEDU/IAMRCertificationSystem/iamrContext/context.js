import { createContext, useContext, useMemo, useReducer } from 'react'
import IamrReducer from './reducer'
import { UseIamrActions } from './actions'
const IamrContext = createContext()

const initialState = {
  skills: [],
  journalEntries: [],
  loading: false
}

function IamrProvider({ children }) {
  const [state, dispatch] = useReducer(IamrReducer, initialState)
  const actions = UseIamrActions(state, dispatch)

  const value = useMemo(() => {
    return {
      skills: state.skills,
      journalEntries: state.journalEntries,
      loading: state.loading,
      ...actions
    }
  }, [state, actions])

  return <IamrContext.Provider value={value}>{children}</IamrContext.Provider>
}

function useIamrContext() {
  const context = useContext(IamrContext)
  if (context === undefined) {
    throw new Error('useIamrContext must be used within a IamrProvider')
  }
  return context
}

export { IamrProvider, useIamrContext }
