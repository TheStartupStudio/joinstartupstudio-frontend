import { useEffect, useState } from 'react'
import axiosInstance from '../AxiosInstance'
import { useSelector } from 'react-redux'

const useUserActivity = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user)
  const [isFirstRendered, setIsFirstRendered] = useState(false)
  const [existUserActivity, setExistUserActivity] = useState(null)
  const [intervalId, setIntervalId] = useState(null)
  const [activeMinutes, setActiveMinutes] = useState(null)

  const intervalTimeout = 60000

  const startInterval = (from) => {
    return setInterval(() => {
      axiosInstance
        .put('/myPerformanceData/updateActivity/endTime')
        .then((response) => {
          setActiveMinutes(response.data.activeMinutes)
        })
        .catch((error) => {
          console.error('Error updating activity:', error)
        })
    }, intervalTimeout)
  }

  const restartInterval = () => {
    return axiosInstance
      .put('/myPerformanceData/updateActivity/restartInterval', {
        isActive: true
      })
      .then((response) => response.data)
  }

  const handleUpdateEndTime = () => {
    axiosInstance
      .put('/myPerformanceData/updateActivity/endTime', { isActive: false })
      .then((response) => {
        setActiveMinutes(response.data.activeMinutes)
      })
      .catch((error) => {
        console.error('Error updating activity:', error)
      })
  }

  const millisecondsToTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0)
    return `${minutes} minutes and ${seconds} seconds`
  }

  useEffect(() => {
    if (user && isAuthenticated) {
      axiosInstance
        .get('/myPerformanceData/userActivity')
        .then(({ data }) => {
          setExistUserActivity(data)
          setIsFirstRendered(true)
          restartInterval().then((data) => {
            if (data) {
              setIntervalId(startInterval('beginning'))
            }
          })
        })
        .catch((error) => {
          console.error('Error fetching user activity:', error)
        })
    }
  }, [user, isAuthenticated])

  useEffect(() => {
    if (!user) {
      clearInterval(intervalId)
    }
  }, [user])

  useEffect(() => {
    if (!existUserActivity && user && isAuthenticated) {
      axiosInstance
        .put('/myPerformanceData/updateActivity/startTime', { isActive: false })
        .then((response) => {
          setIsFirstRendered(true)
          setActiveMinutes(response.data.activeMinutes)
        })
        .catch((error) => {
          console.error('Error updating activity:', error)
        })
    }
  }, [existUserActivity, user, isAuthenticated])

  useEffect(() => {
    if (user && isAuthenticated && isFirstRendered) {
      setIntervalId(startInterval('after logged in and firstRendering'))
    }
  }, [user, isAuthenticated, isFirstRendered])

  useEffect(() => {
    if (user && isAuthenticated && isFirstRendered) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          clearInterval(intervalId)
          handleUpdateEndTime()
        } else {
          restartInterval().then((data) => {
            if (data) {
              setIntervalId(startInterval('on visibility'))
            }
          })
        }
      }

      const handleUnload = () => {
        clearInterval(intervalId)
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('beforeunload', handleUnload)

      return () => {
        clearInterval(intervalId)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('beforeunload', handleUnload)
      }
    } else {
      clearInterval(intervalId)
    }
  }, [isFirstRendered, user, isAuthenticated, intervalId])

  return { activeMinutes }
}

export default useUserActivity
