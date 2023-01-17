export const initialState = {
  studentQuestions: { rows: [], count: 0 },
  certificationFeedbackQuestions: { rows: [], count: 0 },
  questionsMenuSelected: true,
  loading: false
}

const iamrInboxReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SET_STUDENT_QUESTIONS':
      return { ...state, studentQuestions: payload }
    case 'SET_CERTIFICATION_FEEDBACK_QUESTIONS':
      return { ...state, certificationFeedbackQuestions: payload }
    case 'SET_QUESTIONS_MENU_SELECTED':
      return { ...state, questionsMenuSelected: payload }
    case 'SET_LOADING':
      return { ...state, loading: payload }
    default:
      return
  }
}

export default iamrInboxReducer
