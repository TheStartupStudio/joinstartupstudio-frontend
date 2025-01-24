import { jwtDecode } from 'jwt-decode'
import moment from 'moment'
import axios from 'axios'
import { setAuthModal } from '../redux/user/Actions'
import store from '../redux/store'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL

const isTokenExpired = (token) => {
  if (!token) return true
  const decoded = jwtDecode(token)
  return moment.unix(decoded.exp).diff(moment()) < 1
}

export const getTokenExpiration = (token) => {
  if (!token) return null
  try {
    const decoded = jwtDecode(token)
    return decoded.exp ? decoded.exp * 1000 : null
  } catch (error) {
    return null
  }
}

const saveAccessToken = (token) => localStorage.setItem('access_token', token)
const getAccessToken = () => localStorage.getItem('access_token')
const getRefreshToken = () => localStorage.getItem('refresh_token')

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()
  const accessToken = getAccessToken()

  if (!accessToken || !refreshToken) {
    return
  }

  const expirationTime = getTokenExpiration(accessToken)
  if (!expirationTime) {
    return
  }

  const currentTime = Date.now()
  const oneMinuteBeforeExpiry = expirationTime - 30 * 1000

  if (currentTime >= oneMinuteBeforeExpiry) {
    try {
      const response = await axios.post(`${baseURL}auth/refreshToken`, {
        refresh_token: refreshToken
      })

      saveAccessToken(response.data.access_token)
      return {
        newAccessToken: response.data.access_token
      }
    } catch (error) {
      store.dispatch(setAuthModal(true))
      localStorage.setItem('session_expired', true)
      return
    }
  }
}

const startTokenRefreshCheck = () => {
  setInterval(() => {
    const token = getAccessToken()
    if (token && isTokenExpired(token)) {
      refreshAccessToken()
    }
  }, 30 * 1000)
}

export {
  isTokenExpired,
  saveAccessToken,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  startTokenRefreshCheck
}
