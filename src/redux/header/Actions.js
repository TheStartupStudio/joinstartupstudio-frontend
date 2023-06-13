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
} from './Types'

import {
  deleteBriefing,
  getBriefings,
  editBriefing,
  postBriefing,
} from './Service'
import { toast } from 'react-toastify'

export const getBriefingsStart = () => async (dispatch) => {
  dispatch({ type: GET_BRIEFINGS_START })
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
    type: GET_BRIEFINGS_SUCCESS,
    payload: { briefings },
  }
}

export const getBriefingsError = (error) => async (dispatch) => {
  dispatch({
    type: GET_BRIEFINGS_ERROR,
    payload: error?.response?.data?.message || 'Server Error',
  })
}

export const postBriefingStart = (briefing) => async (dispatch) => {
  dispatch({ type: POST_BRIEFING_START })
  try {
    const response = await postBriefing(briefing)
    const briefingData = response.data
    dispatch(postBriefingSuccess(briefingData))
  } catch (error) {
    dispatch(postBriefingError(error))
  }
}

export const postBriefingSuccess = (briefing) => {
  return {
    type: POST_BRIEFING_SUCCESS,
    payload: { briefing },
  }
}

export const postBriefingError = (error) => async (dispatch) => {
  dispatch({
    type: POST_BRIEFING_ERROR,
    payload: error?.response?.data?.message || 'Server Error',
  })
}

export const editBriefingStart = (briefing, briefingId) => async (dispatch) => {
  dispatch({ type: EDIT_BRIEFING_START })
  try {
    const response = await editBriefing(briefing, briefingId)
    const briefingData = response.data
    dispatch(editBriefingSuccess(briefingData))
  } catch (error) {
    dispatch(editBriefingError(error))
  }
}

export const editBriefingSuccess = (briefing) => {
  return {
    type: EDIT_BRIEFING_SUCCESS,
    payload: { briefing },
  }
}

export const editBriefingError = (error) => async (dispatch) => {
  dispatch({
    type: EDIT_BRIEFING_ERROR,
    payload: error?.response?.data?.message || 'Server Error',
  })
}

export const deleteBriefingStart = (briefingId) => async (dispatch) => {
  dispatch({ type: EDIT_BRIEFING_START })
  try {
    const response = await deleteBriefing(briefingId)
    const briefingData = response.data
    dispatch(deleteBriefingSuccess(briefingData))
  } catch (error) {
    dispatch(deleteBriefingError(error))
  }
}

export const deleteBriefingSuccess = (deletedBriefing) => {
  return {
    type: DELETE_BRIEFING_SUCCESS,
    payload: { deletedBriefing },
  }
}

export const deleteBriefingError = (error) => async (dispatch) => {
  dispatch({
    type: DELETE_BRIEFING_ERROR,
    payload: error?.response?.data?.message || 'Server Error',
  })
}
