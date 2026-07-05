import { fetchStreakStart } from '../redux/streak/Actions'

export const refreshStreakProgress = (dispatch, options = {}) => {
  dispatch(
    fetchStreakStart({
      force: true,
      silent: true,
      ...options
    })
  )
}
