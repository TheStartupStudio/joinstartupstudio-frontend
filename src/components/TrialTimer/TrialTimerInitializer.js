import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from '../../utils/AxiosInstance'
import { setTrialTime, decrementTrialTime, stopTrialTime } from '../../redux/trialTimer/actions'

const TrialTimerInitializer = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user.user)
  const { totalSeconds, isTrialActive, lastFetchTime } = useSelector(
    (state) => state.trialTimer
  )

  useEffect(() => {
    // if (!user?.trialStart || user?.subscription_exempt) return

    const shouldFetch = !lastFetchTime || (Date.now() - lastFetchTime) > 300000

    if (shouldFetch) {
      const fetchTrialTime = async () => {
        try {
          const response = await axios.get('/dashboard/trial-time')
          const data = response.data

          if (data.isTrialActive && data.timeRemaining) {
            const initialSeconds = Math.floor(
              data.timeRemaining.totalMilliseconds / 1000
            )
            dispatch(setTrialTime(initialSeconds, true))
          } else {
            dispatch(stopTrialTime())
          }
        } catch (error) {
          console.error('Error fetching trial time:', error)
          dispatch(stopTrialTime())
        }
      }

      fetchTrialTime()
    }
  }, [user?.trialStart, user?.subscription_exempt, lastFetchTime, dispatch])

  useEffect(() => {
    if (!isTrialActive || totalSeconds <= 0) return

    const interval = setInterval(() => {
      dispatch(decrementTrialTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [isTrialActive, totalSeconds, dispatch])

  return null
}

export default TrialTimerInitializer