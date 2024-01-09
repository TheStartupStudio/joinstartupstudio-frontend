import * as types from './types'
import performanceDataService from './service'

export const fetchSectionOneData = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchSectionOneDataPending())
      const data = await performanceDataService.fetchSectionOne()
      dispatch(fetchSectionOneDataFulfilled(data))
    } catch (error) {
      dispatch(fetchSectionOneDataRejected(error))
    }
  }
}
export const fetchSectionTwoData = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchSectionTwoDataPending())
      const data = await performanceDataService.fetchSectionTwo()
      dispatch(fetchSectionTwoDataFulfilled(data))
    } catch (error) {
      dispatch(fetchSectionTwoDataRejected(error))
    }
  }
}
export const fetchCertificationData = (type) => {
  return async (dispatch) => {
    try {
      dispatch(fetchCertificationPending())
      const data = await performanceDataService.fetchCertificateData(type)
      dispatch(fetchCertificationFulfilled(data))
    } catch (error) {
      dispatch(fetchCertificationRejected(error))
    }
  }
}
export const fetchInstructorDebriefData = (type) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorDebriefDataPending())
      const data = await performanceDataService.fetchCertificateData(type)
      dispatch(fetchInstructorDebriefDataFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorDebriefDataRejected(error))
    }
  }
}
export const fetchMasterclassPercentage = (year) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorMasterclassPercentagePending())
      const data = await performanceDataService.fetchMasterclassPercentage(year)
      dispatch(fetchInstructorMasterclassPercentageFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorMasterclassPercentageRejected(error))
    }
  }
}
export const fetchPodcastPercentage = (year) => {
  return async (dispatch) => {
    try {
      dispatch(fetchPodcastPercentagePending())
      const data = await performanceDataService.fetchPodcastPercentage(year)
      dispatch(fetchPodcastPercentagFulfilled(data))
    } catch (error) {
      dispatch(fetchPodcastPercentagRejected(error))
    }
  }
}
export const fetchQAPercentage = (year) => {
  return async (dispatch) => {
    try {
      dispatch(fetchQAPercentagePending())
      const data = await performanceDataService.fetchQAPercentage(year)
      dispatch(fetchQAPercentageFulfilled(data))
    } catch (error) {
      dispatch(fetchQAPercentageRejected(error))
    }
  }
}

export const fetchSectionOneDataPending = () => ({
  type: types.SET_SECTION_ONE_PENDING
})
export function fetchSectionOneDataFulfilled(payload) {
  return { type: types.SET_SECTION_ONE_FULFILLED, payload }
}
export function fetchSectionOneDataRejected(error) {
  return { type: types.SET_SECTION_ONE_REJECTED, error }
}
export const fetchSectionTwoDataPending = () => ({
  type: types.SET_SECTION_TWO_PENDING
})
export function fetchSectionTwoDataFulfilled(payload) {
  return { type: types.SET_SECTION_TWO_FULFILLED, payload }
}
export function fetchSectionTwoDataRejected(error) {
  return { type: types.SET_SECTION_TWO_REJECTED, error }
}
export const fetchCertificationPending = () => ({
  type: types.SET_CERTIFICATION_PENDING
})
export function fetchCertificationFulfilled(payload) {
  return { type: types.SET_CERTIFICATION_FULFILLED, payload }
}
export function fetchCertificationRejected(error) {
  return { type: types.SET_CERTIFICATION_REJECTED, error }
}
export const fetchInstructorDebriefDataPending = () => ({
  type: types.SET_INSTRUCTOR_DEBRIEF_PENDING
})
export function fetchInstructorDebriefDataFulfilled(payload) {
  return { type: types.SET_INSTRUCTOR_DEBRIEF_FULFILLED, payload }
}
export function fetchInstructorDebriefDataRejected(error) {
  return { type: types.SET_INSTRUCTOR_DEBRIEF_REJECTED, error }
}
export const fetchInstructorMasterclassPercentagePending = () => ({
  type: types.SET_MASTERCLASS_PERCENTAGE_PENDING
})
export function fetchInstructorMasterclassPercentageFulfilled(payload) {
  return { type: types.SET_MASTERCLASS_PERCENTAGE_FULFILLED, payload }
}
export function fetchInstructorMasterclassPercentageRejected(error) {
  return { type: types.SET_MASTERCLASS_PERCENTAGE_REJECTED, error }
}
export const fetchPodcastPercentagePending = () => ({
  type: types.SET_PODCAST_PERCENTAGE_PENDING
})
export function fetchPodcastPercentagFulfilled(payload) {
  return { type: types.SET_PODCAST_PERCENTAGE_FULFILLED, payload }
}
export function fetchPodcastPercentagRejected(error) {
  return { type: types.SET_PODCAST_PERCENTAGE_REJECTED, error }
}
export const fetchQAPercentagePending = () => ({
  type: types.SET_QA_PERCENTAGE_PENDING
})
export function fetchQAPercentageFulfilled(payload) {
  return { type: types.SET_QA_PERCENTAGE_FULFILLED, payload }
}
export function fetchQAPercentageRejected(error) {
  return { type: types.SET_QA_PERCENTAGE_REJECTED, error }
}
