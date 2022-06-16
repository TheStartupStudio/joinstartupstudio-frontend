import {
  LOADING_J,
  JOURNAL_SAVE_SUCCESS,
  JOURNAL_SAVE_ERROR,
  JOURNAL_GET_SUCCESS,
  JOURNAL_GET_ERROR,
  JOURNAL_FINISHED_SUCCESS,
  JOURNAL_FINISHED_ERROR,
  GET_FINISHED_JOURNAL_SUCCESS,
  SAVE_FINISHED_JOURNAL_SUCCESS,
  SAVE_FINISHED_COURSE_SUCCESS
} from './Types'

const initialState = {
  loading: false,
  journal: '',
  finishedJournals: '',
  finishedCourses: '',
  successMessage: null,
  errorMessage: null,
  journalFinished: false
}

const journalReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case LOADING_J:
      return {
        ...state,
        loading: true
      }

    case JOURNAL_SAVE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: true,
        errorMessage: null
      }

    case JOURNAL_SAVE_ERROR:
      return {
        ...state,
        loading: false,
        successMessage: false,
        errorMessage: false
      }

    case JOURNAL_GET_SUCCESS:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        journal: payload
      }

    case JOURNAL_GET_ERROR:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        journal: ''
      }
    case GET_FINISHED_JOURNAL_SUCCESS:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        finishedJournals: payload.journals,
        finishedCourses: payload.courses
      }

    case SAVE_FINISHED_JOURNAL_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: null,
        errorMessage: null,
        finishedJournals: [...state.finishedJournals, payload]
      }

    case SAVE_FINISHED_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: null,
        errorMessage: null,
        finishedCourses: [...state.finishedCourses, payload]
      }

    case JOURNAL_FINISHED_SUCCESS:
      return {
        ...state,
        journalFinished: payload
      }

    case JOURNAL_FINISHED_ERROR:
      return {
        ...state,
        journalFinished: ''
      }
    default:
      return state
  }
}

export default journalReducer
