import axios from 'axios'
import {
  getRefreshToken,
  refreshAccessToken,
  saveAccessToken
} from './tokenUtils'

const getSubdomain = () => {
  const hostname = window.location.hostname
  const subdomain = hostname.split('.')[0]
  return subdomain
}

// Check if we're on a joinstartupstudio.com subdomain (master branch/production)
// Must have a subdomain (e.g., fma.joinstartupstudio.com, not just joinstartupstudio.com)
const isJoinstartupstudioDomain = () => {
  const hostname = window.location.hostname
  // Check if it's a joinstartupstudio.com domain with a subdomain
  // Pattern: subdomain.joinstartupstudio.com (at least 3 parts when split by '.')
  const parts = hostname.split('.')
  return hostname.includes('joinstartupstudio.com') && parts.length >= 3 && parts[0] !== 'api'
}

// Construct baseURL: for master branch use api.joinstartupstudio.com/{subdomain}, otherwise use env variable
const getBaseURL = () => {
  if (isJoinstartupstudioDomain()) {
    const subdomain = getSubdomain()
    // Only use the new pattern if we have a valid subdomain
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      return `https://api.joinstartupstudio.com/${subdomain}`
    }
  }
  return process.env.REACT_APP_SERVER_BASE_URL
}

const baseURL = getBaseURL()

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

      if (refreshToken) {
        try {
          const { newAccessToken } = await refreshAccessToken()
          saveAccessToken(newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          return new Promise(() => {})
        }
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
