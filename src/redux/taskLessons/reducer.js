import { updatedLesson } from './service'
import * as types from './types'

const initialState = {
  loading: false,
  lessons: [],
  error: '',
  message: ''
}

const TaskLessonReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.FETCH_LESSONS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_LESSONS_FULFILLED:
      return {
        ...state,
        loading: false,
        lessons: payload,
        error: null
      }
    case types.FETCH_LESSONS_REJECTED:
      return {
        ...state,
        loading: false,
        error: payload
      }

    case types.EDIT_LESSONS_PENDING:
      return {
        ...state,
        saving: true,
        error: null
      }
    case types.EDIT_LESSONS_FULFILLED:
      const updatedLessonInArray = updatedLesson(state.lessons, payload)

      return {
        ...state,
        lessons: updatedLessonInArray,
        saving: false,
        error: null
      }
    case types.EDIT_LESSONS_REJECTED:
      return {
        ...state,
        saving: false,
        error: payload
      }

    case types.CREATE_LESSONS_PENDING:
      return {
        ...state,
        saving: true,
        error: null
      }
    case types.CREATE_LESSONS_FULFILLED:
      return {
        ...state,
        lessons: [...state.lessons, payload],
        saving: false,
        error: null
      }
    case types.CREATE_LESSONS_REJECTED:
      return {
        ...state,
        loading: false,
        saving: payload
      }

    case types.DELETE_LESSONS_PENDING:
      return {
        ...state,
        saving: true,
        error: null
      }
    case types.DELETE_LESSONS_FULFILLED:
      return {
        ...state,
        saving: false,
        lessons: state.lessons.filter((briefing) => briefing.id !== payload.id),
        error: null
      }
    case types.DELETE_LESSONS_REJECTED:
      return {
        ...state,
        saving: false,
        error: payload
      }

    default:
      return state
  }
}

export default TaskLessonReducer
