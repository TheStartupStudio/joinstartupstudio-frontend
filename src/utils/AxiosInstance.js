import axios from 'axios'
import {
  getRefreshToken,
  refreshAccessToken,
  saveAccessToken
} from './tokenUtils'
import { setAuthModal } from '../redux/user/Actions'
import store from '../redux/store'

const getSubdomain = () => {
  const hostname = window.location.hostname
  const subdomain = hostname.split('.')[0]
  return subdomain
}

const baseURL = process.env.REACT_APP_SERVER_BASE_URL

const axiosInstance = axios.create({
  baseURL
})
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = getRefreshToken()
    const originalRequest = error.config

    if (error?.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (error?.response?.status === 401) {
      originalRequest._retry = true

      if (!refreshToken) {
        store.dispatch(setAuthModal(true))
        return Promise.reject(error)
      }

      try {
        const tokenData = await refreshAccessToken()

        if (!tokenData?.newAccessToken) {
          store.dispatch(setAuthModal(true))
          return Promise.reject(error)
        }

        saveAccessToken(tokenData.newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${tokenData.newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        store.dispatch(setAuthModal(true))
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'
axiosInstance.interceptors.request.use(
  async (req) => {
    const token = localStorage.getItem('access_token')

    if (token) req.headers.Authorization = `Bearer ${token}`

    const clientName = getSubdomain()

    const impersonateId = localStorage.getItem('impersonateId')
    if (impersonateId) {
      req.headers['x-impersonate-user'] = impersonateId
    }

    req.headers['x-client-name'] = clientName

    return req
  },
  (error) => {
    console.log('error axios', error)
    return Promise.reject(error)
  }
)

export default axiosInstance
