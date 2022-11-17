import { Auth } from 'aws-amplify'
import axiosInstance from '../utils/AxiosInstance'
// import { useRef } from 'react'
import io from 'socket.io-client'
import { useSelector } from 'react-redux'
import Messenger from '../components/Messenger/Messenger'
import foulWordsJSON from '../assets/json/foul-words.json'
import _ from 'lodash'
import UserContactForm from '../components/UserContactForm'

export const IsUserLevelAuthorized = () => {
  const loggedUserLevel = useSelector((state) => state?.user?.user?.user?.level)
  const loggedUserRole = useSelector(
    (state) => state?.user?.user?.user?.role_id
  )
  return checkLevelAuthorized(loggedUserLevel, loggedUserRole)
}

export const checkLevelAuthorized = (level, role = null) => {
  return role !== 1 || (level !== 'L1' && level !== 'L2' && level !== 'L3')
}

export const refreshToken = async () => {
  const token = JSON.parse(localStorage.getItem('user'))
  await Auth.currentAuthenticatedUser().then((response) => {
    token.token = response.signInUserSession.idToken.jwtToken
    axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${token.token}`

    localStorage.setItem('user', JSON.stringify(token))
  })
}

export const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const validatePassword = (password) => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  return re.test(String(password))
}

export const validateNumber = (number) => {
  const re = /^[+]?[0-9]+$/
  return re.test(number)
}

export const getConnectionRequests = async () => {
  return await axiosInstance
    .get('/connect/requests-count')
    .then((data) => data)
    .catch(() => {
      throw new Error('Something went wrong')
    })
}

export const getConnections = async () => {
  return await axiosInstance
    .get('/connect')
    .then()
    .catch(() => {
      throw new Error('Something went wrong')
    })
}

export const shareVideo = async (message) => {
  const serverBaseURL = `${process.env.REACT_APP_SERVER_BASE_URL}`
  const socket = io(`${serverBaseURL}`)
  socket.emit('sendMessage', message)
}

export const generateString = (length = 10) => {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const ShowMessenger = () => {
  if (IsUserLevelAuthorized()) return <Messenger />
  else return <UserContactForm />
}

export const monthYearOnly = (date) => {
  if (!date) {
    return ''
  }
  const d = new Date(date)
  let month = d.getMonth() + 1
  month = month < 10 ? '0' + month : month
  return `${d.getFullYear()}-${month}`
}

export const formatDate = (date) => {
  if (!date) {
    return null
  }
  const d = date.split('-')
  return `${d[0]}-${d[1]}`
}

export const detectFoulWords = _.debounce((message, callback) => {
  if (message.trim() == '') {
    callback(null)
    return null
  }
  const words = message.split(' ')
  const foulWords = []

  words.map((word) => {
    if (foulWordsJSON.includes(word.toLowerCase())) {
      foulWords.push(word)
    }
  })

  callback(foulWords.length > 0 ? { message, foulWords } : null)
}, 500)

export const removeHtmlFromString = (string) => {
  return string.replace(/<[^>]*>?/gm, '')
}

export function isValidHttpUrl(string) {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (err) {
    return false
  }
}
