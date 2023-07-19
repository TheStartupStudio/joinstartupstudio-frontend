import * as types from './Types'
import usersService from './Service'

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
