import {
  GET_BRIEFINGS_SUCCESS,
  GET_BRIEFINGS_ERROR,
  GET_BRIEFINGS_START,
  POST_BRIEFING_START,
  POST_BRIEFING_SUCCESS,
  POST_BRIEFING_ERROR,
  EDIT_BRIEFING_START,
  EDIT_BRIEFING_SUCCESS,
  EDIT_BRIEFING_ERROR,
  DELETE_BRIEFING_SUCCESS,
  DELETE_BRIEFING_ERROR,
  DELETE_BRIEFING_START,
} from './Types'
import { toast } from 'react-toastify'

const initialState = {
  briefings: [],
  loading: false,
  error: null,
}

const headerReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case GET_BRIEFINGS_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
      break
    case GET_BRIEFINGS_SUCCESS:
      return {
        ...state,
        briefings: payload.briefings,
        loading: false,
        error: null,
      }
      break

    case GET_BRIEFINGS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      }
      break

    case POST_BRIEFING_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
      break

    case POST_BRIEFING_SUCCESS:
      return {
        ...state,
        briefings: [...state.briefings, payload.briefing],
        loading: false,
        error: null,
      }
      break

    case POST_BRIEFING_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      }
      break

    case EDIT_BRIEFING_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
      break

    case EDIT_BRIEFING_SUCCESS:
      const updatedBriefing = payload.briefing
      const updatedBriefings = state.briefings.map((briefing) => {
        if (briefing.id === updatedBriefing.id) {
          return updatedBriefing
        }
        return briefing
      })
      toast.success('Briefing updated successfully.')
      return {
        ...state,
        briefings: updatedBriefings,
        loading: false,
        error: null,
      }

      break

    case EDIT_BRIEFING_ERROR:
      toast.error('Briefing update failed.')

      return {
        ...state,
        loading: false,
        error: payload.error,
      }
      break
    case DELETE_BRIEFING_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
      break
    case DELETE_BRIEFING_SUCCESS:
      const deletedBriefing = payload.briefing
      return {
        ...state,
        briefings: state.briefings.filter(
          (briefing) => briefing.id !== deletedBriefing.id
        ),
        loading: false,
        error: null,
      }
    case DELETE_BRIEFING_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      }
      break

    default:
      return state
  }
}
export default headerReducer
