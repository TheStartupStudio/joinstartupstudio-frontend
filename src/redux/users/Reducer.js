import {
  GET_USER_WITH_ID_PENDING,
  GET_ALL_USERS_FULFILLED,
  GET_USER_WITH_ID_REJECTED,
  GET_USER_WITH_ID_FULFILLED,
  GET_ALL_USERS_PENDING,
  GET_ALL_USERS_REJECTED
} from './Types'

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null
}

const usersReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case GET_ALL_USERS_PENDING:
      return {
        ...state,
        loading: true
      }
    case GET_ALL_USERS_FULFILLED:
      return {
        ...state,
        loading: false,
        users: payload
      }
    case GET_ALL_USERS_REJECTED:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case GET_USER_WITH_ID_PENDING:
      return {
        ...state,
        loading: true
      }
    case GET_USER_WITH_ID_FULFILLED:
      return {
        ...state,
        loading: false,
        selectedUser: payload
      }
    case GET_USER_WITH_ID_REJECTED:
      return {
        ...state,
        loading: false,
        error: payload
      }
    default:
      return state
  }
}

export default usersReducer
