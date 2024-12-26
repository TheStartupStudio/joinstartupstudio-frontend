import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setGeneralLoading } from '../redux/general/Actions'
import axiosInstance from '../utils/AxiosInstance'
import { userLogin } from '../redux'

const useProxyLogin = () => {
  const dispatch = useDispatch()

  const handleProxyLogin = useCallback(
    async (impersonateId, studentCognitoId) => {
      dispatch(setGeneralLoading(true))
      try {
        const response = await axiosInstance.post('/auth/proxy-auth', {
          impersonateId
        })

        const { accessToken } = response.data
        const originalToken = localStorage.getItem('access_token')

        localStorage.setItem('original_access_token', originalToken)
        localStorage.setItem('impersonateId', studentCognitoId)
        localStorage.setItem('access_token', accessToken)

        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`

        const loginResult = await dispatch(userLogin(null, true))

        if (loginResult === 'impersonated') {
          window.location.href = '/dashboard'
          setTimeout(() => {
            dispatch(setGeneralLoading(false))
          }, 1000)
        } else {
          console.error('Impersonation failed or returned an unexpected result')
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.error || 'Something went wrong')
        } else {
          toast.error('Network error')
        }
        dispatch(setGeneralLoading(false))
      } finally {
        dispatch(setGeneralLoading(false))
      }
    },
    [dispatch]
  )

  return { handleProxyLogin }
}

export default useProxyLogin
