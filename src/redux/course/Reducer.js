import {
  GET_VIDEOS_WATCHED,
  GET_VIDEOS_WATCHED_ERROR,
  GET_ALL_NOTES,
  GET_ALL_NOTES_ERROR,
  GET_NOTE_SUCCESS,
  GET_NOTE_ERROR,
  SAVE_NOTE_SUCCESS,
  SAVE_NOTE_ERROR,
  NOTE_REMOVED_SUCCESS,
  FETCH_LTS_COURSE_FINISHED_CONTENT_PENDING,
  FETCH_LTS_COURSE_FINISHED_CONTENT_FULFILLED,
  FETCH_LTS_COURSE_FINISHED_CONTENT_REJECTED,
  FETCH_ENTREPRENEURSHIP_LESSONS_PENDING,
  FETCH_ENTREPRENEURSHIP_LESSONS_FULFILLED,
  FETCH_ENTREPRENEURSHIP_LESSONS_REJECTED
} from './Types'

const initialState = {
  videosWatched: [],
  notes: null,
  note: '',
  successMessage: null,
  errorMessage: null,
  finishedContent: [],
  levelProgress: null,
  lessonsByLevel: {},
  progressLoading: false,
  progressLoaded: false,
  lessonsLoading: false,
  lessonsLoaded: false,
  lastProgressFetchTime: null,
  lastLessonsFetchTime: null,
  loading: false,
  error: null
}

const courseReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case GET_VIDEOS_WATCHED:
      return {
        ...state,
        videosWatched: payload
      }

    case GET_VIDEOS_WATCHED_ERROR:
      return {
        ...state,
        videosWatched: ''
      }

    case GET_ALL_NOTES:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        notes: payload
      }

    case GET_ALL_NOTES_ERROR:
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        notes: ''
      }
    case GET_NOTE_SUCCESS:
      return {
        ...state,
        loading: false,
        note: payload.value
      }

    case GET_NOTE_ERROR:
      return {
        ...state,
        loading: false,
        note: ''
      }
    case SAVE_NOTE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: true,
        errorMessage: null
      }
    case NOTE_REMOVED_SUCCESS:
      return {
        ...state,
        notes: state.notes.filter((note) => note.id != payload),
        loading: false,
        successMessage: false,
        errorMessage: false
      }
    case SAVE_NOTE_ERROR:
      return {
        ...state,
        loading: false,
        successMessage: false,
        errorMessage: false
      }

    case FETCH_LTS_COURSE_FINISHED_CONTENT_PENDING:
      return {
        ...state,
        progressLoading: true,
        error: null
      }
    case FETCH_LTS_COURSE_FINISHED_CONTENT_FULFILLED:
      return {
        ...state,
        progressLoading: false,
        progressLoaded: true,
        finishedContent: payload.finishedContent || [],
        levelProgress: payload.levelProgress || {},
        totalProgress: payload.totalProgress,
        lastProgressFetchTime: Date.now(),
        error: null
      }
    case FETCH_LTS_COURSE_FINISHED_CONTENT_REJECTED:
      return {
        ...state,
        progressLoading: false,
        progressLoaded: true,
        finishedContent: [],
        levelProgress: {},
        error: payload
      }

    case FETCH_ENTREPRENEURSHIP_LESSONS_PENDING:
      return {
        ...state,
        lessonsLoading: true
      }
    case FETCH_ENTREPRENEURSHIP_LESSONS_FULFILLED:
      return {
        ...state,
        lessonsLoading: false,
        lessonsLoaded: true,
        lessonsByLevel: payload,
        lastLessonsFetchTime: Date.now()
      }
    case FETCH_ENTREPRENEURSHIP_LESSONS_REJECTED:
      return {
        ...state,
        lessonsLoading: false,
        lessonsLoaded: true,
        lessonsByLevel: {}
      }

    default:
      return state
  }
}

export default courseReducer
