import {
  GET_VIDEOS_WATCHED,
  GET_VIDEOS_WATCHED_ERROR,
  GET_ALL_NOTES,
  GET_ALL_NOTES_ERROR,
  GET_NOTE_SUCCESS,
  GET_NOTE_ERROR,
  SAVE_NOTE_SUCCESS,
  SAVE_NOTE_ERROR
} from './Types'

const initialState = {
  videosWatched: [],
  notes: null,
  note: '',
  successMessage: null,
  errorMessage: null
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

    case SAVE_NOTE_ERROR:
      return {
        ...state,
        loading: false,
        successMessage: false,
        errorMessage: false
      }

    default:
      return state
  }
}

export default courseReducer
