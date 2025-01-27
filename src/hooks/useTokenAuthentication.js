import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CheckTokenValidity } from '../utils/CheckTokenValidity'
import { Auth } from 'aws-amplify'

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

  const handleLoginRedirect = async () => {
    // history.push('/logout')
    await Auth.signOut()
    window.location.href = '/ims-login'
    localStorage.removeItem('signin-required')
    setAuthModal(false)
  }

  const handleCloseModal = async () => {
    // history.push('/logout')
    await Auth.signOut()
    window.location.href = '/ims-login'
    localStorage.removeItem('signin-required')
    setAuthModal(false)
  }

  return {
    authModal,
    handleLoginRedirect,
    handleCloseModal
  }
}
