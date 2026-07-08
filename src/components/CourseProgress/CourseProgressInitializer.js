import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourseProgressData } from '../../redux/course/Actions'

const CourseProgressInitializer = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user.user)
  const { progressLoading, progressLoaded, lessonsLoading, lessonsLoaded } =
    useSelector((state) => state.course)

  useEffect(() => {
    if (!user?.id) return
    // If a previous request got stuck in `loading` but never reached `loaded`,
    // force-refresh so the widget can exit the skeleton state.
    const isStuck =
      (progressLoading && !progressLoaded) ||
      (lessonsLoading && !lessonsLoaded)

    dispatch(fetchCourseProgressData({ force: isStuck }))
  }, [dispatch, user?.id])

  useEffect(() => {
    if (!user?.id) return

    const handleFocus = () => {
      const isStuck =
        (progressLoading && !progressLoaded) ||
        (lessonsLoading && !lessonsLoaded)
      dispatch(fetchCourseProgressData({ silent: true, force: isStuck }))
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [
    dispatch,
    user?.id,
    progressLoading,
    progressLoaded,
    lessonsLoading,
    lessonsLoaded
  ])

  return null
}

export default CourseProgressInitializer
