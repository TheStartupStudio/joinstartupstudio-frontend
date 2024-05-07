import { updateBriefingInArray } from './Service'
import * as types from './Types'

import { toast } from 'react-toastify'

const initialState = {
  briefings: [],
  selectedBriefing: {},
  loading: false,
  error: null
}

const headerReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_BRIEFINGS_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.GET_BRIEFINGS_SUCCESS:
      return {
        ...state,
        briefings: payload.briefings,
        loading: false,
        error: null
      }
    case types.GET_BRIEFINGS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error
      }
    case types.SELECTED_BRIEFING_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.SELECTED_BRIEFING_SUCCESS:
      return {
        ...state,
        selectedBriefing: payload,
        loading: false,
        error: null
      }
    case types.SELECTED_BRIEFING_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error
      }
    case types.UPDATE_SELECTED_BRIEFING_START:
      return {
        ...state,
        loading: true,
        error: null
      }

    case types.UPDATE_SELECTED_BRIEFING_SUCCESS:
      const updatedSelectedBriefings = updateBriefingInArray(
        state.briefings,
        payload
      )

      return {
        ...state,
        briefings: updatedSelectedBriefings,
        selectedBriefing: payload,
        loading: false,
        error: null
      }

    case types.UPDATE_SELECTED_BRIEFING_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error
      }
    case types.POST_BRIEFING_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.POST_BRIEFING_SUCCESS:
      toast.success('Briefing posted successfully.')

      return {
        ...state,
        briefings: [...state.briefings, payload.briefing],
        loading: false,
        error: null
      }
    case types.POST_BRIEFING_ERROR:
      toast.success('Briefing post failed.')
      return {
        ...state,
        loading: false,
        error: payload.error
      }
    case types.EDIT_BRIEFING_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.EDIT_BRIEFING_SUCCESS:
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
        error: null
      }
    case types.EDIT_BRIEFING_ERROR:
      toast.error('Briefing update failed.')

      return {
        ...state,
        loading: false,
        error: payload.error
      }
    case types.DELETE_BRIEFING_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.DELETE_BRIEFING_SUCCESS:
      const deletedBriefing = payload.briefing
      return {
        ...state,
        briefings: state.briefings.filter(
          (briefing) => briefing.id !== deletedBriefing.id
        ),
        loading: false,
        error: null
      }
    case types.DELETE_BRIEFING_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error
      }
    default:
      return state
  }
}
export default headerReducer
