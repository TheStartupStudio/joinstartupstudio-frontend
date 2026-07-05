import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStreakStart } from '../../redux/streak/Actions'

const StreakWidgetInitializer = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user.user)
  const { isTrialActive } = useSelector((state) => state.trialTimer)
  const { shouldShow } = useSelector((state) => state.studioChallenge)

  useEffect(() => {
    if (!user?.id || isTrialActive || shouldShow) return
    dispatch(fetchStreakStart())
  }, [dispatch, user?.id, isTrialActive, shouldShow])

  useEffect(() => {
    if (!user?.id || isTrialActive) return

    const handleFocus = () => {
      dispatch(fetchStreakStart({ silent: true, force: true }))
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [dispatch, user?.id, isTrialActive])

  useEffect(() => {
    if (!user?.id || isTrialActive || shouldShow) return
    dispatch(fetchStreakStart({ force: true, silent: true }))
  }, [dispatch, user?.id, isTrialActive, shouldShow])

  return null
}

export default StreakWidgetInitializer
