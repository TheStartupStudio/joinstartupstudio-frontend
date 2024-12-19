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
    userSolution: []
  },
  spotlights: [],

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
    case types.FETCH_ALL_SPOTLIGHTS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_ALL_SPOTLIGHTS_FULFILLED:
      return {
        ...state,
        loading: false,
        spotlights: payload,
        error: null
      }
    case types.FETCH_ALL_SPOTLIGHTS_REJECTED:
      return {
        ...state,
        loading: false,
        spotlights: payload,
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

    case types.FETCH_USER_PROBLEM_SOLUTION_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_USER_PROBLEM_SOLUTION_FULFILLED:
      return {
        ...state,
        loading: false,
        industryProblems: {
          ...state.industryProblems,
          userSolution: payload
        },
        error: null
      }
    case types.FETCH_USER_PROBLEM_SOLUTION_REJECTED:
      return {
        ...state,
        loading: false,
        industryProblems: {
          ...state.industryProblems,
          userSolution: payload
        },

        error: payload
      }

    case types.FETCH_SPOTLIGHT_APPLICATION_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_SPOTLIGHT_APPLICATION_FULFILLED:
      return {
        ...state,
        loading: false,
        spotlights: {
          ...state.spotlights,
          userSpotlight: payload
        },
        industries: payload,
        error: null
      }
    case types.FETCH_SPOTLIGHT_APPLICATION_REJECTED:
      return {
        ...state,
        loading: false,
        experiences: {
          ...state.experiences,
          userSpotlight: payload
        },

        error: payload
      }

    case types.HANDLE_SPOTLIGHT_STATUS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.HANDLE_SPOTLIGHT_STATUS_FULFILLED:
      return {
        ...state,
        loading: false,
        spotlights: {
          ...state.spotlights,
          ...payload
        },
        error: null
      }
    case types.HANDLE_SPOTLIGHT_STATUS_REJECTED:
      return {
        ...state,
        loading: false,
        spotlights: {
          ...state.spotlights,
          ...payload
        },
        error: payload
      }

    case types.HANDLE_INDUSTRY_PROBLEM_STATUS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.HANDLE_INDUSTRY_PROBLEM_STATUS_FULFILLED:
      return {
        ...state,
        loading: false,
        industryProblems: {
          ...state.industryProblems,
          ...payload
        },
        error: null
      }
    case types.HANDLE_INDUSTRY_PROBLEM_STATUS_REJECTED:
      return {
        ...state,
        loading: false,
        industryProblems: {
          ...state.industryProblems,
          ...payload
        },
        error: payload
      }
    case types.CREATE_INDUSTRY_PROBLEM_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.CREATE_INDUSTRY_PROBLEM_FULFILLED:
      return {
        ...state,
        loading: false,
        industryProblems: {
          ...state.industryProblems,
          data: state.industryProblems.data.map((problem) =>
            problem.id === payload.industry_problem_ID &&
            problem.company_id === payload.company_ID
              ? { ...problem, submitted: true }
              : problem
          )
        },
        error: null
      }
    case types.CREATE_INDUSTRY_PROBLEM_REJECTED:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case types.CREATE_SPOTLIGHT_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.CREATE_SPOTLIGHT_FULFILLED:
      return {
        ...state,
        loading: false,
        spotlights: [...state.spotlights, action.payload],
        error: null
      }
    case types.CREATE_SPOTLIGHT_REJECTED:
      return {
        ...state,
        loading: false,
        error: payload
      }
    default:
      return state
  }
}

export default myImmersionReducer
