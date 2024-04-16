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

export const fetchAllIndustryProblems = (currentPage, itemsPerPage) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAllIndustryProblemsPending())
      const data = await myImmersionService.fetchIndustryProblems(
        currentPage,
        itemsPerPage
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
