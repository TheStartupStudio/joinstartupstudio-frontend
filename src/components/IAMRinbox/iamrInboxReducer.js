export const initialState = {
  studentQuestions: { rows: [], count: 0, unreadCount: 0 },
  certificationFeedbackQuestions: { rows: [], count: 0, unreadCount: 0 },
  approvalRequests: { rows: [], count: 0, unreadCount: 0 },
  questionsMenuSelected: 'student-questions',
  loading: false,
  replying: false,
}

const iamrInboxReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SET_STUDENT_QUESTIONS':
      return { ...state, studentQuestions: payload }
    case 'SET_CERTIFICATION_FEEDBACK_QUESTIONS':
      return { ...state, certificationFeedbackQuestions: payload }
    case 'SET_APPROVAL_REQUESTS':
      return { ...state, approvalRequests: payload }
    case 'SET_QUESTIONS_MENU_SELECTED':
      return { ...state, questionsMenuSelected: payload }
    case 'SET_LOADING':
      return { ...state, loading: payload }
    case 'SET_REPLYING':
      return { ...state, replying: payload }
    case 'RESET_ALL_QUESTIONS':
      //prettier-ignore
      return {
        ...state,
        studentQuestions: { ...state.studentQuestions, rows: [], count: 0 },
        certificationFeedbackQuestions: {...state.certificationFeedbackQuestions, rows: [], count: 0}
      }
    case 'UPDATE_STUDENT_QUESTIONS':
      return { ...state, studentQuestions: { ...payload } }
    case 'UPDATE_CERTIFICATION_FEEDBACK_QUESTIONS':
      return { ...state, certificationFeedbackQuestions: { ...payload } }
    case 'UPDATE_APPROVAL_REQUEST':
      return { ...state, approvalRequests: { ...payload } }
    case 'DECREASE_STUDENT_QUESTIONS_UNREAD':
      return {
        ...state,
        studentQuestions: {
          ...state.studentQuestions,
          unreadCount: state.studentQuestions.unreadCount - 1,
        },
      }
    case 'DECREASE_CERTIFICATION_FEEDBACK_QUESTIONS_UNREAD':
      return {
        ...state,
        certificationFeedbackQuestions: {
          ...state.certificationFeedbackQuestions,
          unreadCount: state.certificationFeedbackQuestions.unreadCount - 1,
        },
      }
    case 'DECREASE_APPROVAL_REQUESTS':
      return {
        ...state,
        approvalRequests: {
          ...state.approvalRequests,
          unreadCount: state.approvalRequests.unreadCount - 1,
        },
      }
    default:
      return
  }
}

export default iamrInboxReducer
