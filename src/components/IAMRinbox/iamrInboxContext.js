import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useCallback,
} from 'react'
import iamrInboxReducer, { initialState } from './iamrInboxReducer'

const IamrInboxContext = createContext(initialState)

export const IamrInboxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(iamrInboxReducer, initialState)

  const setStudentQuestions = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_STUDENT_QUESTIONS',
        payload,
      })
    },
    [dispatch]
  )

  const setCertificationFeedbackQuestions = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_CERTIFICATION_FEEDBACK_QUESTIONS',
        payload,
      })
    },
    [dispatch]
  )

  const setApprovalRequests = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_APPROVAL_REQUESTS',
        payload,
      })
    },
    [dispatch]
  )

  const selectQuestionsMenu = useCallback(
    (payload) => {
      if (payload === state.questionsMenuSelected || state.replying) return

      dispatch({
        type: 'SET_QUESTIONS_MENU_SELECTED',
        payload: payload,
      })
    },
    [state, dispatch]
  )

  const setLoading = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_LOADING',
        payload: payload,
      })
    },
    [dispatch]
  )

  const setReplying = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_REPLYING',
        payload: payload,
      })
    },
    [dispatch]
  )

  const newMessage = useCallback(
    ({ message, ticket }) => {
      //prettier-ignore
      const questions =
        ticket.type === 'instruction'
          ? state.studentQuestions
          : ticket.type === 'feedback' || ticket.type === 'certification_submit'
          ? state.certificationFeedbackQuestions
          : state.approvalRequests;

      const newRows = questions.rows.map((x) =>
        x.id === ticket.id ? { ...x, TicketAnswers: message } : x
      )

      //prettier-ignore
      const type =
          ticket.type === 'instruction'
            ? 'UPDATE_STUDENT_QUESTIONS'
            : ticket.type === 'feedback' || ticket.type === 'certification_submit'
            ? 'UPDATE_CERTIFICATION_FEEDBACK_QUESTIONS'
            : 'UPDATE_APPROVAL_REQUEST';

      dispatch({
        type: type,
        payload: { ...questions, rows: newRows },
      })
    },
    [dispatch, state]
  )

  const ticketOpened = useCallback(
    (ticket) => {
      //prettier-ignore
      const questions =
        ticket.type === 'instruction'
          ? state.studentQuestions
          : ticket.type === 'feedback' || ticket.type === 'certification_submit'
          ? state.certificationFeedbackQuestions
          : state.approvalRequests;

      const foundIndex = questions.rows.find(
        (row) => row.id === ticket.id && !row.read_by_instructor
      )

      if (!foundIndex) return

      const newRows = questions.rows.map((x) =>
        x.id === ticket.id ? { ...x, read_by_instructor: true } : x
      )

      //prettier-ignore
      const type =
        ticket.type === 'instruction'
          ? 'UPDATE_STUDENT_QUESTIONS'
          : ticket.type === 'feedback' || ticket.type === 'certification_submit'
          ? 'UPDATE_CERTIFICATION_FEEDBACK_QUESTIONS'
          : 'UPDATE_APPROVAL_REQUEST';

      dispatch({
        type: type,
        payload: {
          ...questions,
          unreadCount: questions.unreadCount - 1,
          rows: newRows,
        },
      })
    },
    [
      state.certificationFeedbackQuestions,
      state.studentQuestions,
      state.approvalRequests,
    ]
  )

  const resetAllQuestions = useCallback(() => {
    dispatch({
      type: 'RESET_ALL_QUESTIONS',
    })
  }, [dispatch])

  const value = useMemo(() => {
    return {
      studentQuestions: state.studentQuestions,
      certificationFeedbackQuestions: state.certificationFeedbackQuestions,
      approvalRequests: state.approvalRequests,
      questionsMenuSelected: state.questionsMenuSelected,
      loading: state.loading,
      replying: state.replying,
      setStudentQuestions,
      setCertificationFeedbackQuestions,
      setApprovalRequests,
      selectQuestionsMenu,
      setLoading,
      setReplying,
      newMessage,
      resetAllQuestions,
      ticketOpened,
      dispatch,
    }
  }, [
    state,
    setStudentQuestions,
    selectQuestionsMenu,
    setCertificationFeedbackQuestions,
    setApprovalRequests,
    setLoading,
    setReplying,
    newMessage,
    resetAllQuestions,
    ticketOpened,
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
  // setStudentQuestions function only exists if component has been wrapped in IamrInboxProvider
  if (context?.setStudentQuestions === undefined) {
    throw new Error('useIamrInboxContext must be used within iamrInboxContext')
  }

  return context
}

export default useIamrInboxContext
