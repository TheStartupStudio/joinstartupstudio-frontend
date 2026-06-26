import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChallengeProgressStart } from '../../redux/studioChallenge/Actions'

const StudioBuilderChallengeInitializer = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user.user)
  const { isTrialActive } = useSelector((state) => state.trialTimer)
  const { loaded, lastFetchTime } = useSelector((state) => state.studioChallenge)

  useEffect(() => {
    if (!user?.id) return

    dispatch(fetchChallengeProgressStart())
  }, [dispatch, user?.id])

  useEffect(() => {
    if (!user?.id) return

    const handleFocus = () => {
      dispatch(fetchChallengeProgressStart({ silent: true }))
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [dispatch, user?.id])

  useEffect(() => {
    if (!user?.id || !isTrialActive) return

    const shouldRefresh =
      !loaded || !lastFetchTime || Date.now() - lastFetchTime > 300000

    if (shouldRefresh) {
      dispatch(fetchChallengeProgressStart({ silent: loaded }))
    }
  }, [dispatch, user?.id, isTrialActive, loaded, lastFetchTime])

  return null
}

export default StudioBuilderChallengeInitializer
