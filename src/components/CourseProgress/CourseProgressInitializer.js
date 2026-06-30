import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourseProgressData } from '../../redux/course/Actions'

const CourseProgressInitializer = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user.user)

  useEffect(() => {
    if (!user?.id) return

    dispatch(fetchCourseProgressData())
  }, [dispatch, user?.id])

  useEffect(() => {
    if (!user?.id) return

    const handleFocus = () => {
      dispatch(fetchCourseProgressData({ silent: true }))
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [dispatch, user?.id])

  return null
}

export default CourseProgressInitializer
