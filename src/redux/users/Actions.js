import * as types from './Types'
import usersService from './Service'
import {
  GET_STUDENT_INFO_BY_ID,
  GET_STUDENT_INFO_BY_ID_ERROR,
  GET_STUDENT_INFO_BY_ID_SUCCESS
} from './Types'

export const getUserWithIdAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_USER_WITH_ID_PENDING })

    try {
      const userData = await usersService.getUserWithId(id)

      dispatch({ type: types.GET_USER_WITH_ID_FULFILLED, payload: userData })
    } catch (error) {
      dispatch({
        type: types.GET_USER_WITH_ID_REJECTED,
        payload: error.message
      })
    }
  }
}

export const getAllUsersAction = () => {
  return async (dispatch) => {
    dispatch({ type: types.GET_ALL_USERS_PENDING })

    try {
      const usersData = await usersService.getAllUsers()

      dispatch({ type: types.GET_ALL_USERS_FULFILLED, payload: usersData })
    } catch (error) {
      dispatch({ type: types.GET_ALL_USERS_REJECTED, payload: error.message })
    }
  }
}

export const getStudentInfoById = (id) => async (dispatch) => {
  dispatch({ type: GET_STUDENT_INFO_BY_ID })
  try {
    const response = await usersService.getStudentInfoByIdAPI(id)
    dispatch(getStudentInfoSuccessById(response?.data))
  } catch (error) {
    dispatch(getStudentInfoErrorById(error?.data))
  }
}
export const getStudentInfoSuccessById = (response) => {
  return {
    type: GET_STUDENT_INFO_BY_ID_SUCCESS,
    payload: { data: response }
  }
}

export const getStudentInfoErrorById = (response) => {
  return {
    type: GET_STUDENT_INFO_BY_ID_ERROR,
    payload: { error: response.error }
  }
}

export const editUserById = (data) => {
  return async (dispatch) => {
    dispatch({ type: types.EDIT_USER_WITH_ID_PENDING })

    try {
      const response = await usersService.editUser(data)

      const storedUser = JSON.parse(localStorage.getItem('user')) || {}

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...storedUser,
          user: {
            ...storedUser.user,
            ...response.data.data
          }
        })
      )

      dispatch({
        type: types.EDIT_USER_WITH_ID_FULFILLED,
        payload: response.data
      })
    } catch (error) {
      dispatch({
        type: types.EDIT_USER_WITH_ID_REJECTED,
        payload: error.response?.data || error.message
      })
    }
  }
}
