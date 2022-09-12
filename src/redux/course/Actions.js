import {
  LOADING,
  GET_VIDEOS_WATCHED,
  GET_VIDEOS_WATCHED_ERROR,
  GET_ALL_NOTES,
  GET_ALL_NOTES_ERROR,
  GET_NOTE_SUCCESS,
  GET_NOTE_ERROR,
  SAVE_NOTE_SUCCESS,
  SAVE_NOTE_ERROR,
  NOTE_REMOVED_SUCCESS
} from './Types'

import axiosInstance from '../../utils/AxiosInstance'

export const getVideosWatched = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`/histories`)
    dispatch({
      type: GET_VIDEOS_WATCHED,
      payload: response.data.courses
    })
  } catch (err) {
    dispatch({
      type: GET_VIDEOS_WATCHED_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const getAllNotes = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`notes`)

    dispatch({
      type: GET_ALL_NOTES,
      payload: response.data
    })
  } catch (err) {
    dispatch({
      type: GET_ALL_NOTES_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const getNote = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      `/notes/${data.journal_id != null ? data.journal_id : data.course_id}`
    )

    dispatch({
      type: GET_NOTE_SUCCESS,
      payload: response.data
    })
  } catch (err) {
    dispatch({
      type: GET_NOTE_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const removeNoteFromState = (data) => async (dispatch) => {
  try {
    //loading first
    dispatch({ type: LOADING })

    await axiosInstance.delete(`/notes/${data}`).then((res) => {
      dispatch({
        type: NOTE_REMOVED_SUCCESS,
        payload: data
      })
    })
  } catch (err) {
    dispatch({
      type: SAVE_NOTE_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const saveOrEditNote = (data) => async (dispatch) => {
  try {
    //loading first
    dispatch({ type: LOADING })

    await axiosInstance

      .post(`/notes`, {
        courseId: data.createdFrom === 'course' ? data.course_id : null,
        journalId: data.createdFrom === 'journal' ? data.course_id : null,
        contentId: data.contentId,
        notesTitle: data.note.notesTitle
          ? data.note.notesTitle
          : data.notesTitle,
        value: data.note ? data.note : data.note.notesText,
        createdFrom: data.createdFrom
      })
      .then((res) => {
        dispatch({
          type: SAVE_NOTE_SUCCESS,
          payload: res.data
        })
      })
  } catch (err) {
    dispatch({
      type: SAVE_NOTE_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}
