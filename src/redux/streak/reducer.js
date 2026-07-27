import {
  FETCH_STREAK_START,
  FETCH_STREAK_SUCCESS,
  FETCH_STREAK_ERROR
} from './Types'

const initialState = {
  summary: null,
  loading: false,
  loaded: false,
  shouldShow: false,
  error: null
}

const streakReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STREAK_START:
      return {
        ...state,
        loading: true,
        error: null
      }

    case FETCH_STREAK_SUCCESS:
      return {
        ...state,
        summary: action.payload,
        loading: false,
        loaded: true,
        shouldShow: action.payload?.active === true,
        error: null
      }

    case FETCH_STREAK_ERROR:
      return {
        ...state,
        loading: false,
        loaded: true,
        shouldShow: false,
        error: action.payload
      }

    default:
      return state
  }
}

export default streakReducer
