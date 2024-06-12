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

export const fetchInstructorSectionOneData = (id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorSectionOneDataPending())
      const data = await performanceDataService.fetchInstructorSectionOne(id)
      dispatch(fetchInstructorSectionOneDataFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorSectionOneDataRejected(error))
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
export const fetchInstructorSectionTwoData = (id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorSectionTwoDataPending())
      const data = await performanceDataService.fetchInstructorSectionTwo(id)
      dispatch(fetchInstructorSectionTwoDataFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorSectionTwoDataRejected(error))
    }
  }
}

export const fetchCertificationData = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchCertificationPending())
      const data = await performanceDataService.fetchCertificateData()
      dispatch(fetchCertificationFulfilled(data))
    } catch (error) {
      dispatch(fetchCertificationRejected(error))
    }
  }
}
export const fetchInstructorCertificationData = (id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorCertificationPending())
      const data = await performanceDataService.fetchInstructorCertificateData(
        id
      )
      dispatch(fetchInstructorCertificationFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorCertificationRejected(error))
    }
  }
}

export const fetchInstructorDebriefData = (type) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorDebriefDataPending())
      const data = await performanceDataService.fetchInstructorDebriefData(type)
      dispatch(fetchInstructorDebriefDataFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorDebriefDataRejected(error))
    }
  }
}
export const fetchInstructorDebriefDataWithId = (type, id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorDebriefDataWithIdPending())
      const data =
        await performanceDataService.fetchInstructorDebriefDataWithId(type, id)
      dispatch(fetchInstructorDebriefDataWithIdFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorDebriefDataWithIdRejected(error))
    }
  }
}
export const fetchMasterclassPercentage = (year) => {
  return async (dispatch) => {
    try {
      dispatch(fetchMasterclassPercentagePending())
      const data = await performanceDataService.fetchMasterclassPercentage(year)
      dispatch(fetchMasterclassPercentageFulfilled(data))
    } catch (error) {
      dispatch(fetchMasterclassPercentageRejected(error))
    }
  }
}
export const fetchInstructorMasterclassPercentage = (year, id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorMasterclassPercentagePending())
      const data =
        await performanceDataService.fetchInstructorMasterclassPercentage(
          year,
          id
        )
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
export const fetchInstructorPodcastPercentage = (year, id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorPodcastPercentagePending())
      const data =
        await performanceDataService.fetchInstructorPodcastPercentage(year, id)
      dispatch(fetchInstructorPodcastPercentagFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorPodcastPercentagRejected(error))
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
export const fetchInstructorQAPercentage = (year, id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchInstructorQAPercentagePending())
      const data = await performanceDataService.fetchInstructorQAPercentage(
        year,
        id
      )
      dispatch(fetchInstructorQAPercentageFulfilled(data))
    } catch (error) {
      dispatch(fetchInstructorQAPercentageRejected(error))
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

export const fetchInstructorSectionOneDataPending = () => ({
  type: types.SET_INSTRUCTOR_SECTION_ONE_PENDING
})
export function fetchInstructorSectionOneDataFulfilled(payload) {
  return { type: types.SET_INSTRUCTOR_SECTION_ONE_FULFILLED, payload }
}
export function fetchInstructorSectionOneDataRejected(error) {
  return { type: types.SET_INSTRUCTOR_SECTION_ONE_REJECTED, error }
}

export const fetchInstructorSectionTwoDataPending = () => ({
  type: types.SET_INSTRUCTOR_SECTION_TWO_PENDING
})
export function fetchInstructorSectionTwoDataFulfilled(payload) {
  return { type: types.SET_INSTRUCTOR_SECTION_TWO_FULFILLED, payload }
}
export function fetchInstructorSectionTwoDataRejected(error) {
  return { type: types.SET_INSTRUCTOR_SECTION_TWO_REJECTED, error }
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

export const fetchInstructorCertificationPending = () => ({
  type: types.SET_INSTRUCTOR_CERTIFICATION_PENDING
})
export function fetchInstructorCertificationFulfilled(payload) {
  return { type: types.SET_INSTRUCTOR_CERTIFICATION_FULFILLED, payload }
}
export function fetchInstructorCertificationRejected(error) {
  return { type: types.SET_INSTRUCTOR_CERTIFICATION_REJECTED, error }
}

export const fetchInstructorDebriefDataPending = () => {
  return {
    type: types.SET_INSTRUCTOR_DEBRIEF_PENDING
  }
}
export function fetchInstructorDebriefDataFulfilled(payload) {
  return { type: types.SET_INSTRUCTOR_DEBRIEF_FULFILLED, payload }
}
export function fetchInstructorDebriefDataRejected(error) {
  return { type: types.SET_INSTRUCTOR_DEBRIEF_REJECTED, error }
}

export const fetchInstructorDebriefDataWithIdPending = () => {
  return {
    type: types.SET_INSTRUCTOR_DEBRIEF_WITH_ID_PENDING
  }
}
export function fetchInstructorDebriefDataWithIdFulfilled(payload) {
  return { type: types.SET_INSTRUCTOR_DEBRIEF_WITH_ID_FULFILLED, payload }
}
export function fetchInstructorDebriefDataWithIdRejected(error) {
  return { type: types.SET_INSTRUCTOR_DEBRIEF_WITH_ID_REJECTED, error }
}

export const fetchMasterclassPercentagePending = () => ({
  type: types.SET_MASTERCLASS_PERCENTAGE_PENDING
})
export function fetchMasterclassPercentageFulfilled(payload) {
  return { type: types.SET_MASTERCLASS_PERCENTAGE_FULFILLED, payload }
}
export function fetchMasterclassPercentageRejected(error) {
  return { type: types.SET_MASTERCLASS_PERCENTAGE_REJECTED, error }
}

export const fetchInstructorMasterclassPercentagePending = () => ({
  type: types.SET_INSTRUCTOR_MASTERCLASS_PERCENTAGE_PENDING
})
export function fetchInstructorMasterclassPercentageFulfilled(payload) {
  return {
    type: types.SET_INSTRUCTOR_MASTERCLASS_PERCENTAGE_FULFILLED,
    payload
  }
}
export function fetchInstructorMasterclassPercentageRejected(error) {
  return { type: types.SET_INSTRUCTOR_MASTERCLASS_PERCENTAGE_REJECTED, error }
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

export const fetchInstructorPodcastPercentagePending = () => ({
  type: types.SET_INSTRUCTOR_PODCAST_PERCENTAGE_PENDING
})
export function fetchInstructorPodcastPercentagFulfilled(payload) {
  return { type: types.SET_INSTRUCTOR_PODCAST_PERCENTAGE_FULFILLED, payload }
}
export function fetchInstructorPodcastPercentagRejected(error) {
  return { type: types.SET_INSTRUCTOR_PODCAST_PERCENTAGE_REJECTED, error }
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

export const fetchInstructorQAPercentagePending = () => ({
  type: types.SET_INSTRUCTOR_QA_PERCENTAGE_PENDING
})
export function fetchInstructorQAPercentageFulfilled(payload) {
  return { type: types.SET_INSTRUCTOR_QA_PERCENTAGE_FULFILLED, payload }
}
export function fetchInstructorQAPercentageRejected(error) {
  return { type: types.SET_INSTRUCTOR_QA_PERCENTAGE_REJECTED, error }
}
