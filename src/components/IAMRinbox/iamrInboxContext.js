import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useCallback
} from 'react'
import iamrInboxReducer, { initialState } from './iamrInboxReducer'

const IamrInboxContext = createContext(initialState)

export const IamrInboxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(iamrInboxReducer, initialState)

  const setStudentQuestions = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_STUDENT_QUESTIONS',
        payload
      })
    },
    [dispatch]
  )

  const setCertificationFeedbackQuestions = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_CERTIFICATION_FEEDBACK_QUESTIONS',
        payload
      })
    },
    [dispatch]
  )

  const selectQuestionsMenu = useCallback(
    (payload) => {
      if (payload === state.questionsMenuSelected || state.loading) return

      dispatch({
        type: 'SET_QUESTIONS_MENU_SELECTED',
        payload: payload
      })
    },
    [state, dispatch]
  )

  const setLoading = useCallback(
    async (payload) => {
      dispatch({
        type: 'SET_LOADING',
        payload: payload
      })
    },
    [dispatch]
  )

  const value = useMemo(() => {
    return {
      studentQuestions: state.studentQuestions,
      certificationFeedbackQuestions: state.certificationFeedbackQuestions,
      questionsMenuSelected: state.questionsMenuSelected,
      loading: state.loading,
      setStudentQuestions,
      setCertificationFeedbackQuestions,
      selectQuestionsMenu,
      setLoading,
      dispatch
    }
  }, [
    state,
    setStudentQuestions,
    selectQuestionsMenu,
    setCertificationFeedbackQuestions,
    setLoading
  ])

  return (
    <IamrInboxContext.Provider value={value}>
      {children}
    </IamrInboxContext.Provider>
  )
}

const useIamrInboxContext = () => {
  const context = useContext(IamrInboxContext)

  // Check if context is being used inside IamrInboxProvider
  // setTickets function only exists if component has been wrapped in IamrInboxProvider
  if (context.setStudentQuestions === undefined) {
    throw new Error('useIamrInboxContext must be used within iamrInboxContext')
  }

  return context
}

export default useIamrInboxContext
