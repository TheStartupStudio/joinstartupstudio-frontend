import {
  LOADING,
  LOGIN_LOADING,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  USER_REMOVE_ERROR_MESSAGE,
  USER_CHANGE_NAME,
  EDIT_SOCIAL_MEDIA,
  USER_LOGOUT,
  USER_CHANGE_PROFILE_IMAGE,
  USER_EDIT_ERROR,
  NEED_RESET,
  UPDATE_USER_TNC,
  SESSION_START_TIME,
  SESSION_END_TIME
} from './Types'
import { Auth } from 'aws-amplify'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'

export const userLogin = (old_password) => async (dispatch) => {
  try {
    dispatch({ type: LOADING })

    axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${localStorage.getItem('access_token')}`
    axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'
    const user = await axiosInstance
      .get('/instructor/')
      .then()
      .catch((e) => {
        toast.error(<IntlMessages id="alerts.email_password_incorrect" />)
        dispatch({
          type: LOGIN_LOADING,
          payload: false
        })
        return
      })

    const currentUser = await Auth.currentAuthenticatedUser({
      bypassCache: true
    })
    if (currentUser.attributes['custom:isVerified'] == 0) {
      window.location.href = '/verify-email'
      return
    }

    if (user.data.payment_type === 'school' && !user.data.last_login) {
      dispatch({
        type: NEED_RESET,
        payload: old_password
      })
      dispatch({
        type: LOGIN_LOADING,
        payload: false
      })
      return 'passwordResetRequired'
    }

    if (user.data.is_active !== true) {
      window.location.href = '/verify-email'
      return
    }

    if (
      (!user.data.stripe_subscription_id ||
        user.data.stripe_subscription_id === null) &&
      user.data.customer_id === null
    ) {
      window.location = '/register'
    } else if (
      user.data.customer_id !== null &&
      user.data.stripe_subscription_id === null
    ) {
      if (user.data.payment_type === 'SUB')
        window.location = '/subscription-ended'
      else if (user.data.payment_type === 'TRIAL')
        window.location = '/trial-ended'
    } else {
      let payloadData = user.data

      payloadData.agreedConnections = false
      payloadData.profileImage = user.data.profile_image
      payloadData.language = localStorage.getItem('currentLanguage')

      const userData = {
        token: user.data.cognito_Id,
        user: payloadData
      }

      const user_token = {
        user: payloadData,
        token: localStorage.getItem('access_token')
      }

      localStorage.setItem('user', JSON.stringify(user_token))

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: userData
      })
      // await axiosInstance.post('/myPerformanceData/start').then(({ data }) => {
      //   console.log(data)
      //   dispatch({
      //     type: SESSION_START_TIME,
      //     payload: data
      //   })
      // })

      dispatch({
        type: LOGIN_LOADING,
        payload: false
      })
    }
  } catch (err) {
    dispatch({
      type: USER_LOGIN_ERROR,
      payload: err?.message
    })
  }
}

export const userLogout = () => {
  localStorage.clear()
  console.log(localStorage)
  return {
    type: USER_LOGOUT
  }
}

export const userUpdate = (data) => async (dispatch) => {
  try {
    dispatch({
      type: USER_CHANGE_NAME,
      payload: data
    })
  } catch ({ response }) {
    dispatch({
      type: USER_EDIT_ERROR,
      payload: 'Server Error'
    })
  }
}

export const editSocialMedia = (socialLinks) => async (dispatch) => {
  try {
    dispatch({
      type: EDIT_SOCIAL_MEDIA,
      payload: socialLinks
    })
  } catch ({ response }) {
    dispatch({
      type: USER_EDIT_ERROR,
      payload: 'Server Error'
    })
  }
}

export const userUpdateProfileImage = (data) => async (dispatch) => {
  try {
    dispatch({
      type: USER_CHANGE_PROFILE_IMAGE,
      payload: data
    })
  } catch ({ response }) {
    dispatch({
      type: USER_EDIT_ERROR,
      payload: 'Server Error'
    })
  }
}

export const removeErrorMessage = () => {
  return {
    type: USER_REMOVE_ERROR_MESSAGE
  }
}

export const loginLoading = (data) => async (dispatch) => {
  try {
    dispatch({
      type: LOGIN_LOADING,
      payload: data
    })
  } catch ({ response }) {
    dispatch({
      type: LOGIN_LOADING,
      payload: 'Server Error'
    })
  }
}
export const updateTnC = () => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_USER_TNC
    })
  } catch (err) {
    console.log(err)
  }
}

export const updateStartTime = () => {
  try {
    axiosInstance.post('/myPerformanceData/start').then((res) => {
      return res.data
    })
  } catch (err) {
    console.log(err)
  }
}

// export const updateEndTime = () => async (dispatch) => {
//   try {
//     let newD
//     axiosInstance.patch(`/myPerformanceData/end`).then((res) => {
//       newD = res.data
//       return res.data
//     })
//     return newD
//   } catch (err) {
//     console.log(err)
//   }
// }
