import * as types from './types'

const initialState = {
  loading: false,
  stepLoading: false,
  step: {},
  industries: [],
  companies: [],
  industryProblems: {
    data: [],
    totalItems: 0,
    currentPage: 1,
    limit: 5,
    totalPages: 0,
    submitted: false,
    userSolutions: []
  },
  experiences: {
    data: [],
    totalItems: 0,
    currentPage: 1,
    limit: 5,
    totalPages: 0,
    submitted: false
  },

  error: null,
  message: ''
}

const myImmersionReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case types.FETCH_STEP_PENDING:
      return {
        ...state,
        stepLoading: true,
        error: null
      }
    case types.FETCH_STEP_FULFILLED:
      return {
        ...state,
        step: payload,
        stepLoading: false,
        error: null
      }
    case types.FETCH_STEP_REJECTED:
      return {
        ...state,
        step: payload,
        stepLoading: false,
        error: payload
      }
    case types.FETCH_ALL_INDUSTRY_PROBLEMS_PENDING:
      return {
        ...state,
        stepLoading: true,
        error: null
      }
    case types.FETCH_ALL_INDUSTRY_PROBLEMS_FULFILLED:
      return {
        ...state,
        stepLoading: false,
        industryProblems: {
          ...state.industryProblems,
          ...payload
        },
        error: null
      }
    case types.FETCH_ALL_INDUSTRY_PROBLEMS_REJECTED:
      return {
        ...state,
        stepLoading: false,
        industryProblems: payload,
        error: payload
      }
    case types.FETCH_ALL_EXPERIENCES_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_ALL_EXPERIENCES_FULFILLED:
      return {
        ...state,
        loading: false,
        experiences: {
          ...state.experiences,
          ...payload
        },
        error: null
      }
    case types.FETCH_ALL_EXPERIENCES_REJECTED:
      return {
        ...state,
        loading: false,
        experiences: payload,
        error: payload
      }
    case types.FETCH_ALL_INDUSTRIES_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_ALL_INDUSTRIES_FULFILLED:
      return {
        ...state,
        loading: false,
        industries: payload,
        error: null
      }
    case types.FETCH_ALL_INDUSTRIES_REJECTED:
      return {
        ...state,
        loading: false,
        industries: payload,
        error: payload
      }
    default:
      return state
  }
}

export default myImmersionReducer
