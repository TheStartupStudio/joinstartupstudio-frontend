import * as types from './types'

const initialState = {
  loading: false,
  occupationGroup: {},
  occupationGroups: [],
  occupationJobs: [],
  occupationJob: {},
  occupationContentLoading: false,
  occupationJobLoading: false,
  error: '',
  message: ''
}

const PathwaysReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.CLEANUP_PATHWAYS_STATE:
      return initialState
    case types.FETCH_OCCUPATION_GROUPS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_OCCUPATION_GROUPS_FULFILLED:
      return {
        ...state,
        occupationGroups: payload,
        loading: false,
        error: null
      }
    case types.FETCH_OCCUPATION_GROUPS_REJECTED:
      return {
        ...state,
        occupationGroups: payload,
        loading: false,
        error: payload
      }
    case types.FETCH_OCCUPATION_GROUP_WITH_ID_PENDING:
      return {
        ...state,
        occupationContentLoading: true,
        error: null
      }
    case types.FETCH_OCCUPATION_GROUP_WITH_ID_FULFILLED:
      return {
        ...state,
        occupationGroup: payload,
        occupationContentLoading: false,
        error: null
      }
    case types.FETCH_OCCUPATION_GROUP_WITH_ID_REJECTED:
      return {
        ...state,
        occupationGroup: payload,
        occupationContentLoading: false,
        error: payload
      }
    case types.FETCH_OCCUPATION_JOBS_WITH_GROUP_ID_PENDING:
      return {
        ...state,
        occupationContentLoading: true,
        error: null
      }
    case types.FETCH_OCCUPATION_JOBS_WITH_GROUP_ID_FULFILLED:
      return {
        ...state,
        occupationJobs: payload,
        occupationContentLoading: false,
        error: null
      }
    case types.FETCH_OCCUPATION_JOBS_WITH_GROUP_ID_REJECTED:
      return {
        ...state,
        occupationJobs: payload,
        occupationContentLoading: false,
        error: payload
      }
    case types.FETCH_OCCUPATION_JOB_WITH_ID_PENDING:
      return {
        ...state,
        occupationContentLoading: true,
        error: null
      }
    case types.FETCH_OCCUPATION_JOB_WITH_ID_FULFILLED:
      return {
        ...state,
        occupationJob: payload,
        occupationContentLoading: false,
        error: null
      }
    case types.FETCH_OCCUPATION_JOB_WITH_ID_REJECTED:
      return {
        ...state,
        occupationJob: payload,
        occupationContentLoading: false,
        error: payload
      }
    default:
      return state
  }
}

export default PathwaysReducer
