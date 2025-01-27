import {
  LOADING,
  LOGIN_LOADING,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  USER_LOGOUT,
  USER_REMOVE_ERROR_MESSAGE,
  USER_CHANGE_NAME,
  EDIT_SOCIAL_MEDIA,
  USER_CHANGE_PROFILE_IMAGE,
  NEED_RESET,
  UPDATE_USER_TNC,
  SET_LOGIN_LOADING,
  USER_CHANGE_PROFESSION,
  SET_AUTH_MODAL
} from './Types'

const user = JSON.parse(localStorage.getItem('user'))
const auth_token = localStorage.getItem('access_token')

const initialState = {
  isAuthenticated: user && auth_token ? true : false,
  user: user,
  loading: false,
  successMessage: null,
  errorMessage: null,
  loginLoading: false,
  oldPassword: null,
  authModal: false
}

const userReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_AUTH_MODAL:
      return { ...state, authModal: action.payload }
    case LOGIN_LOADING:
      return {
        ...state,
        loginLoading: payload
      }
    case SET_LOGIN_LOADING:
      return {
        ...state,
        loginLoading: payload
      }

    case NEED_RESET:
      return {
        ...state,
        oldPassword: payload
      }

    case LOADING:
      return {
        ...state,
        loading: true
      }

    case USER_LOGIN_SUCCESS:
      // const currentUser = JSON.stringify(payload)
      // localStorage.setItem('user', currentUser)
      localStorage.setItem('currentLanguage', payload.language)
      localStorage.setItem('name', payload.user.name)
      localStorage.setItem('profileImage', payload.user.profileImage)

      return {
        ...state,
        user: payload,
        loading: false,
        isAuthenticated: true,
        successMessage: null,
        errorMessage: null
      }

    case USER_LOGOUT:
      // window.location.href = '/'
      // localStorage.clear()

      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        successMessage: 'Successfully Logout'
      }
    case USER_LOGIN_ERROR:
      localStorage.clear()
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        successMessage: null,
        errorMessage: payload
      }
    case USER_REMOVE_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: null
      }
    case USER_CHANGE_NAME: {
      const userObject = {
        token: localStorage.getItem('access_token'),
        user: {
          ...state.user.user,
          name: payload
        }
      }
      localStorage.setItem('user', JSON.stringify(userObject))

      return {
        ...state,
        user: {
          ...state.user,
          user: {
            ...state.user.user,
            name: payload
          }
        }
      }
    }
    case USER_CHANGE_PROFESSION: {
      const userObject = {
        token: localStorage.getItem('access_token'),
        user: {
          ...state.user.user,
          profession: payload
        }
      }
      localStorage.setItem('user', JSON.stringify(userObject))

      return {
        ...state,
        user: {
          ...state.user,
          user: {
            ...state.user.user,
            profession: payload
          }
        }
      }
    }
    case USER_CHANGE_PROFILE_IMAGE: {
      const userObject = {
        token: localStorage.getItem('access_token'),
        user: {
          ...state.user.user,
          profileImage: payload,
          profile_image: payload
        }
      }

      localStorage.setItem('user', JSON.stringify(userObject))

      return {
        ...state,
        user: {
          ...state.user,
          user: {
            ...state.user.user,
            profileImage: payload,
            profile_image: payload
          }
        }
      }
    }

    case EDIT_SOCIAL_MEDIA: {
      const userObject = {
        token: localStorage.getItem('access_token'),
        user: {
          ...state.user.user,
          social_links: payload
        }
      }
      localStorage.setItem('user', JSON.stringify(userObject))

      return state
    }

    case UPDATE_USER_TNC: {
      const userObject = {
        token: localStorage.getItem('access_token'),
        user: {
          ...state.user.user,
          TnC: true
        }
      }
      localStorage.setItem('user', JSON.stringify(userObject))

      return state
    }

    default:
      return state
  }
}

export default userReducer
