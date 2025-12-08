import adminDashboardService from './service'
import * as types from './types'

// Metrics Actions
export const fetchMetricsPending = () => ({
  type: types.FETCH_METRICS_PENDING
})

export const fetchMetricsFulfilled = (payload) => ({
  type: types.FETCH_METRICS_FULFILLED,
  payload
})

export const fetchMetricsRejected = (error) => ({
  type: types.FETCH_METRICS_REJECTED,
  error
})

export const fetchMetrics = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchMetricsPending())
      const data = await adminDashboardService.fetchMetrics()
      dispatch(fetchMetricsFulfilled(data))
    } catch (error) {
      dispatch(fetchMetricsRejected(error))
      throw error
    }
  }
}

// Level Statistics Actions
export const fetchLevelStatsPending = () => ({
  type: types.FETCH_LEVEL_STATS_PENDING
})

export const fetchLevelStatsFulfilled = (payload) => ({
  type: types.FETCH_LEVEL_STATS_FULFILLED,
  payload
})

export const fetchLevelStatsRejected = (error) => ({
  type: types.FETCH_LEVEL_STATS_REJECTED,
  error
})

export const fetchLevelStatistics = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchLevelStatsPending())
      const data = await adminDashboardService.fetchLevelStatistics()
      dispatch(fetchLevelStatsFulfilled(data))
    } catch (error) {
      dispatch(fetchLevelStatsRejected(error))
      throw error
    }
  }
}

// Demographics Actions
export const fetchDemographicsPending = () => ({
  type: types.FETCH_DEMOGRAPHICS_PENDING
})

export const fetchDemographicsFulfilled = (payload) => ({
  type: types.FETCH_DEMOGRAPHICS_FULFILLED,
  payload
})

export const fetchDemographicsRejected = (error) => ({
  type: types.FETCH_DEMOGRAPHICS_REJECTED,
  error
})

export const fetchDemographicStatistics = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchDemographicsPending())
      const data = await adminDashboardService.fetchDemographicStatistics()
      dispatch(fetchDemographicsFulfilled(data))
    } catch (error) {
      dispatch(fetchDemographicsRejected(error))
      throw error
    }
  }
}

// User Status Actions
export const fetchUserStatusPending = () => ({
  type: types.FETCH_USER_STATUS_PENDING
})

export const fetchUserStatusFulfilled = (payload) => ({
  type: types.FETCH_USER_STATUS_FULFILLED,
  payload
})

export const fetchUserStatusRejected = (error) => ({
  type: types.FETCH_USER_STATUS_REJECTED,
  error
})

export const fetchUserStatus = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchUserStatusPending())
      const data = await adminDashboardService.fetchUserStatus()
      dispatch(fetchUserStatusFulfilled(data))
    } catch (error) {
      dispatch(fetchUserStatusRejected(error))
      throw error
    }
  }
}

// Analytics Actions
export const fetchAnalyticsPending = () => ({
  type: types.FETCH_ANALYTICS_PENDING
})

export const fetchAnalyticsFulfilled = (payload) => ({
  type: types.FETCH_ANALYTICS_FULFILLED,
  payload
})

export const fetchAnalyticsRejected = (error) => ({
  type: types.FETCH_ANALYTICS_REJECTED,
  error
})

export const fetchAnalytics = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchAnalyticsPending())
      const data = await adminDashboardService.fetchAnalytics()
      dispatch(fetchAnalyticsFulfilled(data))
    } catch (error) {
      dispatch(fetchAnalyticsRejected(error))
      throw error
    }
  }
}

// Revenue Analytics Actions
export const fetchRevenueAnalyticsPending = () => ({
  type: types.FETCH_REVENUE_ANALYTICS_PENDING
})

export const fetchRevenueAnalyticsFulfilled = (payload) => ({
  type: types.FETCH_REVENUE_ANALYTICS_FULFILLED,
  payload
})

export const fetchRevenueAnalyticsRejected = (error) => ({
  type: types.FETCH_REVENUE_ANALYTICS_REJECTED,
  error
})

export const fetchRevenueAnalytics = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      dispatch(fetchRevenueAnalyticsPending())
      const data = await adminDashboardService.fetchRevenueAnalytics(startDate, endDate)
      dispatch(fetchRevenueAnalyticsFulfilled(data))
    } catch (error) {
      dispatch(fetchRevenueAnalyticsRejected(error))
      throw error
    }
  }
}

// Clear Cache Action
export const clearAdminDashboardCache = () => ({
  type: types.CLEAR_ADMIN_DASHBOARD_CACHE
})