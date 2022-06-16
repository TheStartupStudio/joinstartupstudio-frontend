import axios from 'axios'
import { Auth } from 'aws-amplify'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL
})

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    const token = JSON.parse(localStorage.getItem('user'))
    if (
      error.config &&
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const cognitoUser = await Auth.currentAuthenticatedUser()
        const currentSession = await Auth.currentSession()
        cognitoUser.refreshSession(
          currentSession.refreshToken,
          (err, session) => {
            if (err) {
              localStorage.clear()
              window.location.href = '/logout'
            }
            const { idToken } = session
            token.token = idToken.jwtToken
            localStorage.setItem('user', JSON.stringify(token))
            error.config.headers.Authorization = `Bearer ${idToken.jwtToken}`
            return axiosInstance.request(originalRequest)
          }
        )
      } catch (err) {
        localStorage.clear()
        window.location.href = '/logout'
      }
    }

    if (originalRequest._retry) {
      error.config.headers.Authorization = `Bearer ${token.token}`
      return axiosInstance.request(originalRequest)
    }
    return Promise.reject(error)
  }
)

axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'

axiosInstance.interceptors.request.use(
  (request) => {
    const token = JSON.parse(localStorage.getItem('user'))
    if (token) request.headers.Authorization = `Bearer ${token.token}`
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)
axios.interceptors.request.use(
  (request) => {
    return request
  },
  (error) => {
    window.location.replace('/login')
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  (response) => {
    // Edit response config cf
    return response
  },
  (error) => {
    window.location.replace('/login')
    return Promise.reject(error)
  }
)

export default axiosInstance
