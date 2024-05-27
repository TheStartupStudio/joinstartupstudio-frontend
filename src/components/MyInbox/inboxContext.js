import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useCallback
} from 'react'
import inboxReducer, { initialState } from './inboxReducer'

const InboxContext = createContext(initialState)

export const InboxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(inboxReducer, initialState)

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

  const setApprovalRequests = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_APPROVAL_REQUESTS',
        payload
      })
    },
    [dispatch]
  )
  const setIndustryProblems = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_INDUSTRY_PROBLEMS',
        payload
      })
    },
    [dispatch]
  )
  const setImmersionExperiences = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_IMMERSION_EXPERIENCE',
        payload
      })
    },
    [dispatch]
  )

  const selectQuestionsMenu = useCallback(
    (payload) => {
      if (payload === state.questionsMenuSelected || state.replying) return

      dispatch({
        type: 'SET_QUESTIONS_MENU_SELECTED',
        payload: payload
      })
    },
    [state, dispatch]
  )

  const setLoading = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_LOADING',
        payload: payload
      })
    },
    [dispatch]
  )

  const setReplying = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_REPLYING',
        payload: payload
      })
    },
    [dispatch]
  )

  const newMessage = useCallback(
    ({ message, ticket }) => {
      console.log('ticket', ticket)
      //prettier-ignore
      const questions =
        ticket.type === 'instruction'
          ? state.studentQuestions
          : ticket.type === 'feedback' || ticket.type === 'certification_submit'
          ? state.certificationFeedbackQuestions 
          : ticket.type === 'approval' 
          ? state.approvalRequests 
          : ticket.type === 'industry_problem' 
          ? state.industryProblems
          : state.immersionExperience

      const newRows = questions.rows.map((x) =>
        x.id === ticket.id ? { ...x, TicketAnswers: message } : x
      )

      //prettier-ignore
      const type =
          ticket.type === 'instruction'
            ? 'UPDATE_STUDENT_QUESTIONS'
            : ticket.type === 'feedback' || ticket.type === 'certification_submit'
            ? 'UPDATE_CERTIFICATION_FEEDBACK_QUESTIONS' 
            : ticket.type === 'approval' 
            ? 'UPDATE_APPROVAL_REQUEST' 
            : ticket.type === 'industry_problem' 
            ? 'UPDATE_INDUSTRY_PROBLEMS'
            : 'UPDATE_IMMERSION_EXPERIENCE'

      dispatch({
        type: type,
        payload: { ...questions, rows: newRows }
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
          : ticket.type === 'approval' 
          ? state.approvalRequests 
          : ticket.type === 'industry_problem' 
          ? state.industryProblems
          : state.immersionExperience

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
        : ticket.type === 'approval' 
        ? 'UPDATE_APPROVAL_REQUEST' 
        : ticket.type === 'industry_problem' 
        ? 'UPDATE_INDUSTRY_PROBLEMS'
        : 'UPDATE_IMMERSION_EXPERIENCE'

      console.log('ticket.type', ticket.type)

      dispatch({
        type: type,
        payload: {
          ...questions,
          unreadCount: questions.unreadCount - 1,
          rows: newRows
        }
      })
    },
    [
      state.certificationFeedbackQuestions,
      state.studentQuestions,
      state.approvalRequests,
      state.industryProblems,
      state.immersionExperience
    ]
  )

  const resetAllQuestions = useCallback(() => {
    dispatch({
      type: 'RESET_ALL_QUESTIONS'
    })
  }, [dispatch])

  const value = useMemo(() => {
    return {
      studentQuestions: state.studentQuestions,
      certificationFeedbackQuestions: state.certificationFeedbackQuestions,
      approvalRequests: state.approvalRequests,
      questionsMenuSelected: state.questionsMenuSelected,
      industryProblems: state.industryProblems,
      immersionExperiences: state.immersionExperiences,
      loading: state.loading,
      replying: state.replying,
      setStudentQuestions,
      setCertificationFeedbackQuestions,
      setApprovalRequests,
      setIndustryProblems,
      setImmersionExperiences,
      selectQuestionsMenu,
      setLoading,
      setReplying,
      newMessage,
      resetAllQuestions,
      ticketOpened,
      dispatch
    }
  }, [
    state,
    setStudentQuestions,
    selectQuestionsMenu,
    setCertificationFeedbackQuestions,
    setApprovalRequests,
    setIndustryProblems,
    setImmersionExperiences,
    setLoading,
    setReplying,
    newMessage,
    resetAllQuestions,
    ticketOpened
  ])

  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
}

const useInboxContext = () => {
  const context = useContext(InboxContext)

  // Check if context is being used inside IamrInboxProvider
  // setStudentQuestions function only exists if component has been wrapped in IamrInboxProvider
  if (context?.setStudentQuestions === undefined) {
    throw new Error('useIamrInboxContext must be used within iamrInboxContext')
  }

  return context
}

export default useInboxContext
