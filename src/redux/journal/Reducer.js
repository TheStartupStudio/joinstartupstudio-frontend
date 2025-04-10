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
  SAVE_FINISHED_COURSE_SUCCESS,
  SET_JOURNAL_TITLES,
  GET_JOURNAL_DATA_REQUEST,
  GET_JOURNAL_DATA_SUCCESS,
  GET_JOURNAL_DATA_ERROR
} from './Types'

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
  journalTitles: []
}

const journalReducer = (state = initialState, action) => {
  switch (action.type) {
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
        journal: action.payload
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
        finishedJournals: action.payload.journals,
        finishedCourses: action.payload.courses
      }

    case SAVE_FINISHED_JOURNAL_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: null,
        errorMessage: null,
        finishedJournals: [...state.finishedJournals, action.payload]
      }

    case SAVE_FINISHED_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: null,
        errorMessage: null,
        finishedCourses: [...state.finishedCourses, action.payload]
      }

    case JOURNAL_FINISHED_SUCCESS:
      return {
        ...state,
        journalFinished: action.payload
      }

    case JOURNAL_FINISHED_ERROR:
      return {
        ...state,
        journalFinished: ''
      }
    case SET_JOURNAL_TITLES:
      return {
        ...state,
        journalTitles: action.payload
      }
    case GET_JOURNAL_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      }
    case GET_JOURNAL_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        journalData: action.payload,
        error: null
      }
    case GET_JOURNAL_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
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
