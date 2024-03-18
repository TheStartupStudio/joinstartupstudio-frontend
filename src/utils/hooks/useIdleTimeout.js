import { useState, useEffect } from 'react'

const useIdleTimeout = (initialTimeout = 3000) => {
  const [isActiveUser, setIsActiveUser] = useState(true)
  const [expireTime, setExpireTime] = useState(
    localStorage.getItem('expireTime')
      ? parseInt(localStorage.getItem('expireTime'), 10)
      : Date.now() + initialTimeout
  )

  const checkForInactivity = () => {
    if (expireTime < Date.now()) {
      console.log('Inactive!')
      setIsActiveUser(false)
    } else {
      setIsActiveUser(true) // User is active
    }
  }

  const updateExpireTime = () => {
    const newExpireTime = Date.now() + initialTimeout
    setExpireTime(newExpireTime)
    localStorage.setItem('expireTime', newExpireTime.toString())
    setIsActiveUser(true) // User is active
  }

  useEffect(() => {
    const storedExpireTime = localStorage.getItem('expireTime')
    if (storedExpireTime) {
      setExpireTime(parseInt(storedExpireTime, 10))
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, set user as inactive
        setIsActiveUser(false)
      } else {
        // Tab is visible, set user as active and update expire time
        setIsActiveUser(true)
        updateExpireTime()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleVisibilityChange)
    }
  }, [initialTimeout])

  return { isActiveUser, expireTime }
}

export default useIdleTimeout
