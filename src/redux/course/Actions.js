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
  NOTE_REMOVED_SUCCESS,
  FETCH_LTS_COURSE_FINISHED_CONTENT_PENDING,
  FETCH_LTS_COURSE_FINISHED_CONTENT_FULFILLED,
  FETCH_LTS_COURSE_FINISHED_CONTENT_REJECTED,
  FETCH_ENTREPRENEURSHIP_LESSONS_PENDING,
  FETCH_ENTREPRENEURSHIP_LESSONS_FULFILLED,
  FETCH_ENTREPRENEURSHIP_LESSONS_REJECTED
} from './Types'

import axiosInstance from '../../utils/AxiosInstance'
import { transformEntrepreneurshipLessons } from '../../utils/transformEntrepreneurshipLessons'

const STALE_MS = 5 * 60 * 1000

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

export const fetchLtsCoursefinishedContent =
  ({ silent = false, force = false } = {}) =>
  async (dispatch, getState) => {
    const { course } = getState()
    const { progressLoading, progressLoaded, lastProgressFetchTime } = course

    if (progressLoading && !force) {
      return
    }

    if (
      !force &&
      progressLoaded &&
      lastProgressFetchTime &&
      Date.now() - lastProgressFetchTime < STALE_MS
    ) {
      return {
        finishedContent: course.finishedContent || [],
        levelProgress: course.levelProgress
      }
    }

    if (!silent && !progressLoaded) {
      dispatch({ type: FETCH_LTS_COURSE_FINISHED_CONTENT_PENDING })
    }

    try {
      const response = await axiosInstance.get(
        '/ltsJournals/LtsCoursefinishedContent'
      )

      dispatch({
        type: FETCH_LTS_COURSE_FINISHED_CONTENT_FULFILLED,
        payload: response.data
      })
      return response.data
    } catch (error) {
      dispatch({
        type: FETCH_LTS_COURSE_FINISHED_CONTENT_REJECTED,
        payload: error?.response?.data?.message || 'Server Error'
      })
    }
  }

export const fetchEntrepreneurshipLessons =
  ({ silent = false, force = false } = {}) =>
  async (dispatch, getState) => {
    const { course } = getState()
    const { lessonsLoading, lessonsLoaded, lastLessonsFetchTime } = course

    if (lessonsLoading && !force) {
      return
    }

    if (
      !force &&
      lessonsLoaded &&
      lastLessonsFetchTime &&
      Date.now() - lastLessonsFetchTime < STALE_MS
    ) {
      return
    }

    if (!silent && !lessonsLoaded) {
      dispatch({ type: FETCH_ENTREPRENEURSHIP_LESSONS_PENDING })
    }

    try {
      const response = await axiosInstance.get(
        '/LtsJournals/entrepreneurship/lessons'
      )

      dispatch({
        type: FETCH_ENTREPRENEURSHIP_LESSONS_FULFILLED,
        payload: transformEntrepreneurshipLessons(response.data)
      })
    } catch (error) {
      dispatch({
        type: FETCH_ENTREPRENEURSHIP_LESSONS_REJECTED,
        payload: error?.response?.data?.message || 'Server Error'
      })
    }
  }

export const fetchCourseProgressData =
  (options = {}) =>
  (dispatch) => {
    dispatch(fetchLtsCoursefinishedContent(options))
    dispatch(fetchEntrepreneurshipLessons(options))
  }
