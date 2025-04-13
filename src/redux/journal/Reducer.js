import * as types from './Types'

const initialState = {
  journalData: null,
  loading: false,
  error: null,
  journal: '',
  finishedJournals: '',
  finishedCourses: '',
  successMessage: null,
  errorMessage: null,
  journalFinished: false,
  journalTitles: [],
  finishedContent: []
}

const journalReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING_J:
      return {
        ...state,
        loading: true
      }

    case types.JOURNAL_SAVE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: true,
        errorMessage: null
      }

    case types.JOURNAL_SAVE_ERROR:
      return {
        ...state,
        loading: false,
        successMessage: false,
        errorMessage: false
      }

    case types.JOURNAL_GET_SUCCESS:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        journal: action.payload
      }

    case types.JOURNAL_GET_ERROR:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        journal: ''
      }
    case types.GET_FINISHED_JOURNAL_SUCCESS:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        finishedJournals: action.payload.journals,
        finishedCourses: action.payload.courses
      }

    case types.SAVE_FINISHED_JOURNAL_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: null,
        errorMessage: null,
        finishedJournals: [...state.finishedJournals, action.payload]
      }

    case types.SAVE_FINISHED_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: null,
        errorMessage: null,
        finishedCourses: [...state.finishedCourses, action.payload]
      }

    case types.JOURNAL_FINISHED_SUCCESS:
      return {
        ...state,
        journalFinished: action.payload
      }

    case types.JOURNAL_FINISHED_ERROR:
      return {
        ...state,
        journalFinished: ''
      }
    case types.SET_JOURNAL_TITLES:
      return {
        ...state,
        journalTitles: action.payload
      }
    case types.GET_JOURNAL_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.GET_JOURNAL_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        journalData: action.payload,
        error: null
      }
    case types.GET_JOURNAL_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case types.FETCH_JOURNAL_FINISHED_CONTENT_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_JOURNAL_FINISHED_CONTENT_FULFILLED:
      return {
        ...state,
        loading: false,
        finishedContent: action.payload,
        error: null
      }
    case types.FETCH_JOURNAL_FINISHED_CONTENT_REJECTED:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case 'CLEAR_JOURNAL_DATA':
      return {
        ...state,
        journalData: null
      }
    
    case 'RESET_JOURNAL_STATE':
      return initialState

    default:
      return state
  }
}

export default journalReducer
