import { Auth } from 'aws-amplify'
import axiosInstance from '../utils/AxiosInstance'
// import { useRef } from 'react'
import io from 'socket.io-client'
import { useSelector } from 'react-redux'
import Messenger from '../components/Messenger/Messenger'
import foulWordsJSON from '../assets/json/foul-words.json'
import _ from 'lodash'
import UserContactForm from '../components/UserContactForm'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import {
  faChartBar,
  faCircle,
  faCity,
  faMountain,
  faPaintBrush,
  faPaintRoller,
  faUser,
  faUsers,
  faAppleAlt,
  faBalanceScale,
  faBuilding,
  faCalculator,
  faDesktop,
  faFilm,
  faGraduationCap,
  faHandHoldingMedical,
  faHandHoldingUsd,
  faHeartbeat,
  faPeopleArrows,
  faPlay,
  faStar,
  faSwimmer,
  faTree,
  faTruckMoving,
  faUserTie,
  faWrench,
  faHeadset,
  faBook
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'

const iconMap = {
  architectureAndEngineering: faCity,
  artAndDesign: faPaintBrush,
  buildingAndGroundsCleaning: faPaintRoller,
  bussinesAndFinancial: faChartBar,
  communityAndSocialService: faUsers,
  computerAndInformationTech: faDesktop,
  contructionAndExtraction: faBuilding,
  educationalInstructionAndLibrary: faGraduationCap,
  entertainmentAndSport: faSwimmer,
  farmingAndFishinAndForest: faTree,
  foodpreparationAndServing: faAppleAlt,
  healthcare: faHeartbeat,
  installationMaintenanceAndRepair: faWrench,
  legal: faBalanceScale,
  lifePhysicalAndSocialScience: faPeopleArrows,
  management: faUserTie,
  math: faCalculator,
  mediaAndCommunication: faPlay,
  military: faStar,
  officeAndAdministrativeSupport: faHeadset,
  personalCareAndService: faHandHoldingMedical,
  production: faFilm,
  protectiveService: faUser,
  sales: faHandHoldingUsd,
  transportationAndMaterialMoving: faTruckMoving
}

export const IsUserLevelAuthorized = () => {
  const loggedUserLevel = useSelector((state) => state?.user?.user?.user?.level)
  const loggedUserRole = useSelector(
    (state) => state?.user?.user?.user?.role_id
  )
  return checkLevelAuthorized(loggedUserLevel, loggedUserRole)
}

export const checkLevelAuthorized = (level, role = null) => {
  return role !== 1 || (level !== 'LS' && level !== 'MS' && level !== 'HS')
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
  const socket = io(`${serverBaseURL}`, { transports: ['websocket'] })
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

export const beautifulDateFormat = (date, customFormat = null) => {
  if (!date) return
  const dateNow = new Date()
  const inputDate = new Date(date)

  const dateDifference =
    (dateNow.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24.0)

  // if (customFormat) return format(new Date(date), customFormat)

  if (dateDifference > 6) {
    return format(
      new Date(inputDate.toISOString().slice(0, -1)),
      customFormat?.type === 'hours' ? customFormat.format : 'MMMM dd, yyyy'
    )
  } else if (dateDifference < 1 && customFormat?.type !== 'hours') {
    return 'Today'
  } else {
    return format(
      new Date(inputDate.toISOString().slice(0, -1)),
      customFormat?.format ?? "EEEE h:mmaaaaa'm'"
    )
  }
}

export const showErrors = (e) => {
  const error = e.response?.data
  return (
    <>
      {Array.isArray(error?.errors)
        ? error?.errors.map((error) => toast.error(error.message))
        : toast.error(error)}
    </>
  )
}

export const getCertificationType = (skillType) => {
  if (skillType === 'student-certification-1') {
    return 1
  } else if (skillType === 'student-certification-2') {
    return 2
  }
  return null
}

export const getIconComponent = (iconIdentifier, color) => {
  const icon = iconMap[iconIdentifier]
  return icon ? <FontAwesomeIcon icon={icon} style={{ color: color }} /> : null
}

export const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

export const formatDateString = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-CA')
}

export const getFormattedDate = (date) => {
  const formattedDate = moment(date).format('YYYY-MM-DD')
  return formattedDate
}
export const fileNameExtracter = (url) => {
  const extractedString = url?.split('/')[5]

  return extractedString?.length > 30
    ? `${extractedString.substring(0, 40)}...pdf`
    : extractedString
}

export const uploadImage = async (imageFile) => {
  // debugger
  try {
    const response = await axiosInstance.post(
      // '/upload/img-transform',
      '/upload/img',
      imageFile,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    if (response.data.success) {
      return response.data.fileLocation
    } else {
      console.error('Upload failed:', response.data)
      toast.error('Image upload failed, please try again!')
      return null
    }
  } catch (err) {
    toast.error('Image upload failed, please try again!')
    return null
  }
}

export const deleteImage = async (fileLocation) => {
  try {
    const response = await axiosInstance.delete('/upload/img', {
      data: { fileLocation }
    })
    if (response.data.success) {
      toast.success('Image deleted successfully!')
      return true
    } else {
      console.error('Delete failed:', response.data)
      toast.error('Image deletion failed, please try again!')
      return false
    }
  } catch (err) {
    toast.error('Image deletion failed, please try again!')
    return false
  }
}

export function convertDateToMonthYear(dateString) {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long' }
  return date.toLocaleDateString('en-US', options)
}

export const formatDateToInputValue = (date) => {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export const convertImageFileToFormData = (imageFile) => {
  const formData = new FormData()
  formData.append('img', imageFile)
  return formData
}
