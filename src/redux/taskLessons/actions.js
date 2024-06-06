import taskLessonService from './service'
import * as types from './types'

export const fetchLessons = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchLessonsPending())
      const data = await taskLessonService.fetchLessons()
      dispatch(fetchLessonsFulfilled(data))
    } catch (error) {
      dispatch(fetchLessonsRejected(error))
    }
  }
}

export const editLesson = (id, data) => {
  return async (dispatch) => {
    try {
      dispatch(editLessonPending())
      const res = await taskLessonService.editLesson(id, data)
      dispatch(editLessonFulfilled(res))
    } catch (error) {
      dispatch(editLessonRejected(error))
    }
  }
}
export const createLesson = (data) => {
  return async (dispatch) => {
    try {
      dispatch(createLessonPending())
      const res = await taskLessonService.createLesson(data)
      dispatch(createLessonFulfilled(res))
    } catch (error) {
      dispatch(createLessonRejected(error))
    }
  }
}
export const deleteLesson = (id) => {
  return async (dispatch) => {
    try {
      dispatch(deleteLessonPending())
      const data = await taskLessonService.deleteLesson(id)
      dispatch(deleteLessonFulfilled(data))
    } catch (error) {
      dispatch(deleteLessonRejected(error))
    }
  }
}

export const fetchLessonsPending = () => ({
  type: types.FETCH_LESSONS_PENDING
})
export function fetchLessonsFulfilled(payload) {
  return { type: types.FETCH_LESSONS_FULFILLED, payload }
}
export function fetchLessonsRejected(error) {
  return { type: types.FETCH_LESSONS_REJECTED, error }
}

export const editLessonPending = () => ({
  type: types.EDIT_LESSONS_PENDING
})
export function editLessonFulfilled(payload) {
  return { type: types.EDIT_LESSONS_FULFILLED, payload }
}
export function editLessonRejected(error) {
  return { type: types.EDIT_LESSONS_REJECTED, error }
}

export const createLessonPending = () => ({
  type: types.CREATE_LESSONS_PENDING
})
export function createLessonFulfilled(payload) {
  return { type: types.CREATE_LESSONS_FULFILLED, payload }
}
export function createLessonRejected(error) {
  return { type: types.CREATE_LESSONS_REJECTED, error }
}

export const deleteLessonPending = () => ({
  type: types.DELETE_LESSONS_PENDING
})
export function deleteLessonFulfilled(payload) {
  return { type: types.DELETE_LESSONS_FULFILLED, payload }
}
export function deleteLessonRejected(error) {
  return { type: types.DELETE_LESSONS_REJECTED, error }
}
