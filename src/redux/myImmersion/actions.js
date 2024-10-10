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

export const fetchExperiences = (currentPage, itemsPerPage) => {
  return async (dispatch) => {
    try {
      dispatch(fetchExperiencesPending())
      const data = await myImmersionService.fetchExperiences(
        currentPage,
        itemsPerPage
      )
      dispatch(fetchExperiencesFulfilled(data))
    } catch (error) {
      dispatch(fetchExperiencesRejected(error))
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
export const fetchUserExperienceApplication = (user_ID, experience_ID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchUserExperienceApplicationPending())
      const data = await myImmersionService.fetchUserExperienceApplication(
        user_ID,
        experience_ID
      )
      dispatch(fetchUserExperienceApplicationFulfilled(data))
    } catch (error) {
      dispatch(fetchUserExperienceApplicationRejected(error))
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
export const handleExperienceStatus = (id, status) => {
  return async (dispatch) => {
    try {
      dispatch(handleExperienceStatusPending())
      const data = await myImmersionService.handleExperienceStatus(id, status)
      dispatch(handleExperienceStatusFulfilled(data))
    } catch (error) {
      dispatch(handleExperienceStatusRejected(error))
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

export const fetchExperiencesPending = () => ({
  type: types.FETCH_ALL_EXPERIENCES_PENDING
})
export function fetchExperiencesFulfilled(payload) {
  return { type: types.FETCH_ALL_EXPERIENCES_FULFILLED, payload }
}
export function fetchExperiencesRejected(error) {
  return { type: types.FETCH_ALL_EXPERIENCES_REJECTED, error }
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

export const fetchUserExperienceApplicationPending = () => ({
  type: types.FETCH_USER_EXPERIENCE_APPLICATION_PENDING
})
export function fetchUserExperienceApplicationFulfilled(payload) {
  return { type: types.FETCH_USER_EXPERIENCE_APPLICATION_FULFILLED, payload }
}
export function fetchUserExperienceApplicationRejected(error) {
  return { type: types.FETCH_USER_EXPERIENCE_APPLICATION_REJECTED, error }
}

export const handleExperienceStatusPending = () => ({
  type: types.HANDLE_EXPERIENCE_STATUS_PENDING
})
export function handleExperienceStatusFulfilled(payload) {
  return { type: types.HANDLE_EXPERIENCE_STATUS_FULFILLED, payload }
}
export function handleExperienceStatusRejected(error) {
  return { type: types.HANDLE_EXPERIENCE_STATUS_REJECTED, error }
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
