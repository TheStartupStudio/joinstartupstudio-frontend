import PathwaysService from './service'
import * as types from './types'

export const cleanupPathwaysState = () => ({
  type: types.CLEANUP_PATHWAYS_STATE
})

export const fetchOccupationGroups = () => {
  return async (dispatch) => {
    dispatch(fetchOccupationGroupsPending())
    try {
      const data = await PathwaysService.fetchOccupationGroups()
      dispatch(fetchOccupationGroupsFulfilled(data))
    } catch (error) {
      dispatch(fetchOccupationGroupsRejected(error))
    }
  }
}
export const fetchOccupationGroupWithID = (occupationGroupID) => {
  return async (dispatch) => {
    dispatch(fetchOccupationGroupWithIDPending())
    try {
      const data = await PathwaysService.fetchOccupationGroupWithID(
        occupationGroupID
      )
      dispatch(fetchOccupationGroupWithIDFulfilled(data))
    } catch (error) {
      dispatch(fetchOccupationGroupWithIDRejected(error))
    }
  }
}
export const fetchOccupationJobsBasedOnGroupID = (occupationGroupID) => {
  return async (dispatch) => {
    dispatch(fetchOccupationJobsBasedOnGroupIDPending())
    try {
      const data = await PathwaysService.fetchOccupationJobsBasedOnGroupId(
        occupationGroupID
      )
      dispatch(fetchOccupationJobsBasedOnGroupIDFulfilled(data))
    } catch (error) {
      dispatch(fetchOccupationJobsBasedOnGroupIDRejected(error))
    }
  }
}

export const fetchOccupationJobWithID = (occupationJobID) => {
  return async (dispatch) => {
    dispatch(fetchOccupationJonWithIDPending())
    try {
      const data = await PathwaysService.fetchOccupationJobWithID(
        occupationJobID
      )
      dispatch(fetchOccupationJonWithIDFulfilled(data))
    } catch (error) {
      dispatch(fetchOccupationJonWithIDRejected(error))
    }
  }
}

export const fetchOccupationGroupsPending = () => ({
  type: types.FETCH_OCCUPATION_GROUPS_PENDING
})
export function fetchOccupationGroupsFulfilled(payload) {
  return { type: types.FETCH_OCCUPATION_GROUPS_FULFILLED, payload }
}
export function fetchOccupationGroupsRejected(error) {
  return { type: types.FETCH_OCCUPATION_GROUPS_REJECTED, error }
}
export const fetchOccupationGroupWithIDPending = () => ({
  type: types.FETCH_OCCUPATION_GROUP_WITH_ID_PENDING
})
export function fetchOccupationGroupWithIDFulfilled(payload) {
  return { type: types.FETCH_OCCUPATION_GROUP_WITH_ID_FULFILLED, payload }
}
export function fetchOccupationGroupWithIDRejected(error) {
  return { type: types.FETCH_OCCUPATION_GROUP_WITH_ID_REJECTED, error }
}
export const fetchOccupationJobsBasedOnGroupIDPending = () => ({
  type: types.FETCH_OCCUPATION_JOBS_WITH_GROUP_ID_PENDING
})
export function fetchOccupationJobsBasedOnGroupIDFulfilled(payload) {
  return { type: types.FETCH_OCCUPATION_JOBS_WITH_GROUP_ID_FULFILLED, payload }
}
export function fetchOccupationJobsBasedOnGroupIDRejected(error) {
  return { type: types.FETCH_OCCUPATION_JOBS_WITH_GROUP_ID_REJECTED, error }
}
export const fetchOccupationJonWithIDPending = () => ({
  type: types.FETCH_OCCUPATION_JOB_WITH_ID_PENDING
})
export function fetchOccupationJonWithIDFulfilled(payload) {
  return { type: types.FETCH_OCCUPATION_JOB_WITH_ID_FULFILLED, payload }
}
export function fetchOccupationJonWithIDRejected(error) {
  return { type: types.FETCH_OCCUPATION_JOB_WITH_ID_REJECTED, error }
}
