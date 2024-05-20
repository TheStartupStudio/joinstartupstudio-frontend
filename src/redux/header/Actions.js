import * as types from './Types'

import {
  deleteBriefing,
  getBriefings,
  editBriefing,
  getSelectedBriefing,
  updateSelectedBriefing,
  createBriefing
} from './Service'

export const getBriefingsStart = () => async (dispatch) => {
  dispatch({ type: types.GET_BRIEFINGS_START })
  try {
    const response = await getBriefings()
    const briefings = response.data
    dispatch(getBriefingsSuccess(briefings))
  } catch (error) {
    dispatch(getBriefingsError(error))
  }
}

export const getBriefingsSuccess = (briefings) => {
  return {
    type: types.GET_BRIEFINGS_SUCCESS,
    payload: { briefings }
  }
}

export const getBriefingsError = (error) => async (dispatch) => {
  dispatch({
    type: types.GET_BRIEFINGS_ERROR,
    payload: error?.response?.data?.message || 'Server Error'
  })
}
export const getSelectedBriefingStart = () => async (dispatch) => {
  dispatch({ type: types.SELECTED_BRIEFING_START })
  try {
    const data = await getSelectedBriefing()
    dispatch(getSelectedBriefingSuccess(data))
  } catch (error) {
    dispatch(getSelectedBriefingError(error))
  }
}

export const getSelectedBriefingSuccess = (payload) => {
  return {
    type: types.SELECTED_BRIEFING_SUCCESS,
    payload
  }
}

export const getSelectedBriefingError = (error) => async (dispatch) => {
  dispatch({
    type: types.SELECTED_BRIEFING_ERROR,
    payload: error?.response?.data?.message || 'Server Error'
  })
}
export const updateSelectedBriefingStart = (briefingID) => async (dispatch) => {
  dispatch({ type: types.UPDATE_SELECTED_BRIEFING_START })
  try {
    const data = await updateSelectedBriefing(briefingID)
    dispatch(updateSelectedBriefingSuccess(data))
  } catch (error) {
    dispatch(updateSelectedBriefingError(error))
  }
}

export const updateSelectedBriefingSuccess = (payload) => {
  return {
    type: types.UPDATE_SELECTED_BRIEFING_SUCCESS,
    payload
  }
}

export const updateSelectedBriefingError = (error) => async (dispatch) => {
  dispatch({
    type: types.UPDATE_SELECTED_BRIEFING_ERROR,
    payload: error?.response?.data?.message || 'Server Error'
  })
}

export const editBriefingStart = (briefing, briefingId) => async (dispatch) => {
  dispatch({ type: types.EDIT_BRIEFING_START })
  try {
    const data = await editBriefing(briefing, briefingId)
    dispatch(editBriefingSuccess(data))
  } catch (error) {
    dispatch(editBriefingError(error))
  }
}

export const editBriefingSuccess = (payload) => {
  return {
    type: types.EDIT_BRIEFING_SUCCESS,
    payload
  }
}

export const editBriefingError = (error) => async (dispatch) => {
  dispatch({
    type: types.EDIT_BRIEFING_ERROR,
    payload: error?.response?.data?.message || 'Server Error'
  })
}
export const createBriefingStart = (briefing) => async (dispatch) => {
  dispatch({ type: types.POST_BRIEFING_START })
  try {
    const data = await createBriefing(briefing)

    dispatch(createBriefingSuccess(data))
  } catch (error) {
    dispatch(createBriefingError(error))
  }
}

export const createBriefingSuccess = (payload) => {
  return {
    type: types.POST_BRIEFING_SUCCESS,
    payload
  }
}

export const createBriefingError = (error) => async (dispatch) => {
  dispatch({
    type: types.POST_BRIEFING_ERROR,
    payload: error?.response?.data?.message || 'Server Error'
  })
}
export const deleteBriefingStart = (briefingId) => async (dispatch) => {
  dispatch({ type: types.DELETE_BRIEFING_START })
  try {
    const data = await deleteBriefing(briefingId)
    dispatch(deleteBriefingSuccess(data))
  } catch (error) {
    dispatch(deleteBriefingError(error))
  }
}

export const deleteBriefingSuccess = (payload) => {
  return {
    type: types.DELETE_BRIEFING_SUCCESS,
    payload
  }
}

export const deleteBriefingError = (error) => async (dispatch) => {
  dispatch({
    type: types.DELETE_BRIEFING_ERROR,
    payload: error?.response?.data?.message || 'Server Error'
  })
}
