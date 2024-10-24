import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CheckTokenValidity } from '../utils/CheckTokenValidity'

export const useTokenAuthentication = (isAuthenticated) => {
  const [authModal, setAuthModal] = useState(false)
  const history = useHistory()

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const tokens = await CheckTokenValidity()
        if (!tokens) {
          localStorage.clear()
          setAuthModal(true)
          localStorage.setItem('signin-required', 'true')
        }
      }
    }

    if (isAuthenticated) {
      document.addEventListener('visibilitychange', handleVisibilityChange)

      handleVisibilityChange()

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    const showModal = localStorage.getItem('signin-required') === 'true'
    if (showModal && !isAuthenticated) {
      history.push('/ims-login')
      localStorage.removeItem('signin-required')
    }
  }, [isAuthenticated, history])

  const handleLoginRedirect = () => {
    history.push('/logout')
    localStorage.removeItem('signin-required')
    setAuthModal(false)
  }

  const handleCloseModal = () => {
    localStorage.removeItem('signin-required')
    history.push('/logout')
    setAuthModal(false)
  }

  return {
    authModal,
    handleLoginRedirect,
    handleCloseModal
  }
}
