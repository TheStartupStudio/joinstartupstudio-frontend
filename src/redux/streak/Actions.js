import {
  FETCH_STREAK_START,
  FETCH_STREAK_SUCCESS,
  FETCH_STREAK_ERROR
} from './Types'
import { getStreakSummary } from './Service'

export const fetchStreakStart =
  ({ silent = false, force = false } = {}) =>
  async (dispatch, getState) => {
    const { streak, trialTimer } = getState()

    if (trialTimer.isTrialActive && !force) {
      return
    }

    const { studioChallenge } = getState()
    if (studioChallenge.shouldShow && !force) {
      return
    }

    if (streak.loading && !force) {
      return
    }

    if (!silent && !streak.loaded) {
      dispatch({ type: FETCH_STREAK_START })
    }

    try {
      const response = await getStreakSummary()
      dispatch({
        type: FETCH_STREAK_SUCCESS,
        payload: response.data
      })
    } catch (error) {
      dispatch({
        type: FETCH_STREAK_ERROR,
        payload: error?.response?.data?.message || 'Failed to load streak'
      })
    }
  }
