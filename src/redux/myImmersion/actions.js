import myImmersionService from './service'
import * as types from './types'

export const fetchStep = (step) => {
  return async (dispatch) => {
    try {
      dispatch(fetchStepPending())
      const data = await myImmersionService.fetchStep(step)
      dispatch(fetchStepFulfilled(data))
    } catch (error) {
      dispatch(fetchStepRejected(error))
    }
  }
}

export const fetchAllIndustryProblems = (
  currentPage,
  itemsPerPage,
  industry
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAllIndustryProblemsPending())
      const step = 1
      const data = await myImmersionService.fetchIndustryProblems(
        step,
        currentPage,
        itemsPerPage,
        industry
      )

      dispatch(fetchAllIndustryProblemsFulfilled(data))
    } catch (error) {
      dispatch(fetchAllIndustryProblemsRejected(error))
    }
  }
}

export const fetchSpotlights = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchSpotlightsPending())
      const data = await myImmersionService.fetchSpotlights()
      dispatch(fetchSpotlightsFulfilled(data))
    } catch (error) {
      dispatch(fetchSpotlightsRejected(error))
    }
  }
}

export const fetchAllIndustries = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchAllIndustriesPending())
      const data = await myImmersionService.fetchAllIndustries()
      dispatch(fetchAllIndustriesFulfilled(data))
    } catch (error) {
      dispatch(fetchAllIndustriesRejected(error))
    }
  }
}

export const fetchUserProblemSolution = (user_ID, solution_ID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchUserProblemSolutionPending())
      const data = await myImmersionService.fetchUserProblemSolution(
        user_ID,
        solution_ID
      )
      dispatch(fetchUserProblemSolutionFulfilled(data))
    } catch (error) {
      dispatch(fetchUserProblemSolutionsRejected(error))
    }
  }
}
export const fetchSpotlightApplication = (user_ID, spotlight_ID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchSpotlightApplicationPending())
      const data = await myImmersionService.fetchUserSpotlightApplication(
        user_ID,
        spotlight_ID
      )
      dispatch(fetchSpotlightApplicationFulfilled(data))
    } catch (error) {
      dispatch(fetchSpotlightApplicationRejected(error))
    }
  }
}
export const handleIndustryProblemStatus = (id, status) => {
  return async (dispatch) => {
    try {
      dispatch(handleIndustryProblemStatusPending())
      const data = await myImmersionService.handleIndustryProblemStatus(
        id,
        status
      )
      dispatch(handleIndustryProblemStatusFulfilled(data))
    } catch (error) {
      dispatch(handleIndustryProblemStatusRejected(error))
    }
  }
}
export const handleSpotlightStatus = (id, status, feedbackMessage = '') => {
  return async (dispatch) => {
    try {
      dispatch(handleSpotlightStatusPending())
      const data = await myImmersionService.handleSpotlightStatus(
        id,
        status,
        feedbackMessage
      )
      dispatch(handleSpotlightStatusFulfilled(data))
    } catch (error) {
      dispatch(handleSpotlightStatusRejected(error))
    }
  }
}

export const fetchStepPending = () => ({
  type: types.FETCH_STEP_PENDING
})
export function fetchStepFulfilled(payload) {
  return { type: types.FETCH_STEP_FULFILLED, payload }
}
export function fetchStepRejected(error) {
  return { type: types.FETCH_STEP_REJECTED, error }
}

export const fetchAllIndustryProblemsPending = () => ({
  type: types.FETCH_ALL_INDUSTRY_PROBLEMS_PENDING
})
export function fetchAllIndustryProblemsFulfilled(payload) {
  return { type: types.FETCH_ALL_INDUSTRY_PROBLEMS_FULFILLED, payload }
}
export function fetchAllIndustryProblemsRejected(error) {
  return { type: types.FETCH_ALL_INDUSTRY_PROBLEMS_REJECTED, error }
}

export const fetchSpotlightsPending = () => ({
  type: types.FETCH_ALL_SPOTLIGHTS_PENDING
})
export function fetchSpotlightsFulfilled(payload) {
  return { type: types.FETCH_ALL_SPOTLIGHTS_FULFILLED, payload }
}
export function fetchSpotlightsRejected(error) {
  return { type: types.FETCH_ALL_SPOTLIGHTS_REJECTED, error }
}

export const fetchAllIndustriesPending = () => ({
  type: types.FETCH_ALL_INDUSTRIES_PENDING
})
export function fetchAllIndustriesFulfilled(payload) {
  return { type: types.FETCH_ALL_INDUSTRIES_FULFILLED, payload }
}
export function fetchAllIndustriesRejected(error) {
  return { type: types.FETCH_ALL_INDUSTRIES_REJECTED, error }
}

export const fetchUserProblemSolutionPending = () => ({
  type: types.FETCH_USER_PROBLEM_SOLUTION_PENDING
})
export function fetchUserProblemSolutionFulfilled(payload) {
  return { type: types.FETCH_USER_PROBLEM_SOLUTION_FULFILLED, payload }
}
export function fetchUserProblemSolutionsRejected(error) {
  return { type: types.FETCH_USER_PROBLEM_SOLUTION_REJECTED, error }
}

export const fetchSpotlightApplicationPending = () => ({
  type: types.FETCH_SPOTLIGHT_APPLICATION_PENDING
})
export function fetchSpotlightApplicationFulfilled(payload) {
  return { type: types.FETCH_SPOTLIGHT_APPLICATION_FULFILLED, payload }
}
export function fetchSpotlightApplicationRejected(error) {
  return { type: types.FETCH_SPOTLIGHT_APPLICATION_REJECTED, error }
}

export const handleSpotlightStatusPending = () => ({
  type: types.HANDLE_SPOTLIGHT_STATUS_PENDING
})
export function handleSpotlightStatusFulfilled(payload) {
  return { type: types.HANDLE_SPOTLIGHT_STATUS_FULFILLED, payload }
}
export function handleSpotlightStatusRejected(error) {
  return { type: types.HANDLE_SPOTLIGHT_STATUS_REJECTED, error }
}

export const handleIndustryProblemStatusPending = () => ({
  type: types.HANDLE_INDUSTRY_PROBLEM_STATUS_PENDING
})
export function handleIndustryProblemStatusFulfilled(payload) {
  return { type: types.HANDLE_INDUSTRY_PROBLEM_STATUS_FULFILLED, payload }
}
export function handleIndustryProblemStatusRejected(error) {
  return { type: types.HANDLE_INDUSTRY_PROBLEM_STATUS_REJECTED, error }
}
