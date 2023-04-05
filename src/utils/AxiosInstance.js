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
    const token = JSON.parse(localStorage.getItem('user'))

    if (!token || error?.response?.status !== 401 || error.config._retry) {
      return Promise.reject(error)
    }

    if (error?.response?.status === 401) {
      error.config._retry = true
    }

    const cognitoUser = await Auth.currentAuthenticatedUser()
    const currentSession = cognitoUser.signInUserSession
    return new Promise((resolve, reject) => {
      const token = JSON.parse(localStorage.getItem('user'))
      cognitoUser.refreshSession(
        currentSession.refreshToken,
        (err, session) => {
          // do something with the new session
          if (err) {
            localStorage.clear()
            window.location.href = '/logout'
            reject()
          }
          const { idToken } = session
          token.token = idToken.jwtToken
          localStorage.setItem('user', JSON.stringify(token))
          error.config.headers.Authorization = `Bearer ${idToken.jwtToken}`
          resolve()
        }
      )
    })
      .then(() => {
        return axios.request(error.config)
      })
      .catch((e) => Promise.reject(error))
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

export default axiosInstance
