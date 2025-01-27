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
  SET_LOGIN_LOADING,
  USER_CHANGE_PROFESSION,
  SET_AUTH_MODAL
} from './Types'
import axiosInstance from '../../utils/AxiosInstance'

import {
  createUserToken,
  fetchAdminAccess,
  fetchUserData,
  fetchUserRole,
  handleUserRedirect,
  saveUserToken
} from '../../utils/helpers'

export const userLogin =
  (old_password, isImpersonation = false) =>
  async (dispatch) => {
    try {
      dispatch({ type: LOADING })

      const token = localStorage.getItem('access_token')
      if (token) {
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token}`
      } else {
        console.error('Access token is missing from localStorage')
      }
      axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'

      if (isImpersonation) {
        const user = await fetchUserData()
        const userRole = await fetchUserRole()
        const isAdmin = await fetchAdminAccess()

        const userToken = createUserToken(user, isAdmin, userRole)

        saveUserToken(userToken, false, userRole)

        dispatch({ type: USER_LOGIN_SUCCESS, payload: userToken })
        dispatch({ type: LOGIN_LOADING, payload: false })

        return 'impersonated'
      }

      const user = await fetchUserData()
      const userRole = await fetchUserRole()

      const redirectMessage = handleUserRedirect(user)
      if (redirectMessage) {
        dispatch({ type: LOGIN_LOADING, payload: false })
        dispatch({ type: NEED_RESET, payload: old_password })
        return redirectMessage
      }

      const isAdmin = await fetchAdminAccess()
      const userToken = createUserToken(user, isAdmin, userRole)

      saveUserToken(userToken, false, userRole)

      dispatch({ type: USER_LOGIN_SUCCESS, payload: userToken })
      dispatch({ type: LOGIN_LOADING, payload: false })

      if (user) {
        return 'instructor'
      }
    } catch (err) {
      dispatch({ type: USER_LOGIN_ERROR, payload: err?.message })
      return undefined
    }
  }

export const userLogout = () => async (dispatch) => {
  dispatch({ type: LOADING })
  const refresh_token = localStorage.getItem('refresh_token')
  try {
    await axiosInstance.post('/auth/logout', {
      refresh_token
    })
    dispatch({ type: USER_LOGOUT })
  } catch (error) {
    return false
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
export const userUpdateProfession = (data) => async (dispatch) => {
  try {
    dispatch({
      type: USER_CHANGE_PROFESSION,
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

export const setLoginLoading = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: SET_LOGIN_LOADING,
      payload: payload
    })
  } catch (error) {
    console.log(error)
  }
}

export const setAuthModal = (state) => {
  return {
    type: SET_AUTH_MODAL,
    payload: state
  }
}
