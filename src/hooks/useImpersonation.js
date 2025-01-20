import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useImpersonation = (originalToken) => {
  const location = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const mode = urlParams.get('mode')

    if (mode === 'endImpersonation') {
      localStorage.setItem('access_token', originalToken)
      localStorage.removeItem('original_access_token')
      localStorage.removeItem('impersonateId')
      window.location.href = '/dashboard'
    }
  }, [location.search, originalToken])
}

export default useImpersonation
