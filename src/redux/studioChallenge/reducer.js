import {
  FETCH_CHALLENGE_PROGRESS_START,
  FETCH_CHALLENGE_PROGRESS_SUCCESS,
  FETCH_CHALLENGE_PROGRESS_ERROR,
  CLEAR_CHALLENGE_PROGRESS
} from './Types'

const initialState = {
  progress: null,
  loading: false,
  loaded: false,
  shouldShow: false,
  error: null,
  lastFetchTime: null
}

const studioChallengeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHALLENGE_PROGRESS_START:
      return {
        ...state,
        loading: true,
        error: null
      }

    case FETCH_CHALLENGE_PROGRESS_SUCCESS: {
      const progress = action.payload
      const shouldShow =
        progress?.challengeAvailable === true && progress?.isTrialing === true

      return {
        ...state,
        progress,
        loading: false,
        loaded: true,
        error: null,
        lastFetchTime: Date.now(),
        shouldShow
      }
    }

    case FETCH_CHALLENGE_PROGRESS_ERROR:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.payload,
        shouldShow: false,
        lastFetchTime: Date.now()
      }

    case CLEAR_CHALLENGE_PROGRESS:
      return initialState

    default:
      return state
  }
}

export default studioChallengeReducer
