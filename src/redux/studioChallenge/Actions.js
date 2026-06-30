import {
  FETCH_CHALLENGE_PROGRESS_START,
  FETCH_CHALLENGE_PROGRESS_SUCCESS,
  FETCH_CHALLENGE_PROGRESS_ERROR,
  CLEAR_CHALLENGE_PROGRESS
} from './Types'
import { getChallengeProgress } from './Service'

const STALE_MS = 5 * 60 * 1000

export const clearChallengeProgress = () => ({
  type: CLEAR_CHALLENGE_PROGRESS
})

export const fetchChallengeProgressStart =
  ({ silent = false, force = false } = {}) =>
  async (dispatch, getState) => {
    const { studioChallenge } = getState()
    const { lastFetchTime, loaded, loading } = studioChallenge

    if (loading && !force) {
      return
    }

    if (
      !force &&
      loaded &&
      lastFetchTime &&
      Date.now() - lastFetchTime < STALE_MS
    ) {
      return
    }

    if (!silent && !loaded) {
      dispatch({ type: FETCH_CHALLENGE_PROGRESS_START })
    }

    try {
      const response = await getChallengeProgress()
      dispatch({
        type: FETCH_CHALLENGE_PROGRESS_SUCCESS,
        payload: response.data
      })
    } catch (error) {
      dispatch({
        type: FETCH_CHALLENGE_PROGRESS_ERROR,
        payload: error?.response?.data?.message || 'Failed to load challenge'
      })
    }
  }
