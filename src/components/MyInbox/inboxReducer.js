export const initialState = {
  studentQuestions: { rows: [], count: 0, unreadCount: 0 },
  certificationFeedbackQuestions: { rows: [], count: 0, unreadCount: 0 },
  approvalRequests: { rows: [], count: 0, unreadCount: 0 },
  industryProblems: { rows: [], count: 0, unreadCount: 0 },
  immersionExperiences: { rows: [], count: 0, unreadCount: 0 },
  questionsMenuSelected: 'student_questions',
  loading: false,
  replying: false
}

const inboxReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SET_STUDENT_QUESTIONS':
      return { ...state, studentQuestions: payload }
    case 'SET_CERTIFICATION_FEEDBACK_QUESTIONS':
      return { ...state, certificationFeedbackQuestions: payload }
    case 'SET_APPROVAL_REQUESTS':
      return { ...state, approvalRequests: payload }
    case 'SET_INDUSTRY_PROBLEMS':
      return { ...state, industryProblems: payload }
    case 'SET_IMMERSION_EXPERIENCE':
      return { ...state, immersionExperiences: payload }
    case 'SET_QUESTIONS_MENU_SELECTED':
      return { ...state, questionsMenuSelected: payload }
    case 'SET_LOADING':
      return { ...state, loading: payload }
    case 'SET_REPLYING':
      return { ...state, replying: payload }
    case 'RESET_ALL_QUESTIONS':
      return {
        ...state,
        studentQuestions: { ...state.studentQuestions, rows: [], count: 0 },
        certificationFeedbackQuestions: {
          ...state.certificationFeedbackQuestions,
          rows: [],
          count: 0
        }
      }
    case 'UPDATE_STUDENT_QUESTIONS':
      return { ...state, studentQuestions: { ...payload } }
    case 'UPDATE_CERTIFICATION_FEEDBACK_QUESTIONS':
      return { ...state, certificationFeedbackQuestions: { ...payload } }
    case 'UPDATE_APPROVAL_REQUEST':
      return { ...state, approvalRequests: { ...payload } }
    case 'UPDATE_INDUSTRY_PROBLEMS':
      return { ...state, industryProblems: { ...payload } }
    case 'UPDATE_IMMERSION_EXPERIENCE':
      return { ...state, immersionExperiences: { ...payload } }
    case 'DECREASE_STUDENT_QUESTIONS_UNREAD':
      return {
        ...state,
        studentQuestions: {
          ...state.studentQuestions,
          unreadCount: state.studentQuestions.unreadCount - 1
        }
      }
    case 'DECREASE_CERTIFICATION_FEEDBACK_QUESTIONS_UNREAD':
      return {
        ...state,
        certificationFeedbackQuestions: {
          ...state.certificationFeedbackQuestions,
          unreadCount: state.certificationFeedbackQuestions.unreadCount - 1
        }
      }
    case 'DECREASE_APPROVAL_REQUESTS':
      return {
        ...state,
        approvalRequests: {
          ...state.approvalRequests,
          unreadCount: state.approvalRequests.unreadCount - 1
        }
      }
    case 'DECREASE_INDUSTRY_PROBLEMS':
      return {
        ...state,
        industryProblems: {
          ...state.industryProblems,
          unreadCount: state.industryProblems.unreadCount - 1
        }
      }
    case 'DECREASE_IMMERSION_EXPERIENCE':
      return {
        ...state,
        immersionExperiences: {
          ...state.immersionExperiences,
          unreadCount: state.immersionExperiences.unreadCount - 1
        }
      }
    default:
      return
  }
}

export default inboxReducer
