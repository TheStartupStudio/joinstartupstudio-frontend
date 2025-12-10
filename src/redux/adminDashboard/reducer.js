import * as types from './types'

const initialState = {
  metricsLoading: false,
  levelStatsLoading: false,
  demographicsLoading: false,
  userStatusLoading: false,
  analyticsLoading: false,
  revenueAnalyticsLoading: false,
  metrics: {
    paidUsers: 0,
    totalRevenue: 0,
    churnRate: 0
  },
  levelStatistics: {
    l1Learners: 0,
    l2Learners: 0,
    l3Learners: 0,
    avgDaysL1: 0,
    avgDaysL2: 0,
    avgDaysL3: 0,
    totalEnrolledLearners: 0,
    totalCompletedAIE: 0,
    avgDaysAll: 0,
    portfolioStatistics: {
      portfoliosCreated: 0,
      totalCompletedPortfolios: 0,
      completionRate: 0
    }
  },
  demographics: {
    genderDistribution: {},
    ageDistribution: {},
    countryDistribution: {}
  },
  userStatus: {
    trials: 0,
    paid: 0,
    cancelled: 0
  },
  analytics: {
    totalVisitors: 0,
    browserDistribution: {},
    deviceDistribution: {},
    referralDistribution: {},
    trafficOrigin: {}
  },
  revenueAnalytics: {
    paidUsersData: [],
    revenueData: []
  },
  lastFetched: null,
  error: null
}

const adminDashboardReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    // Metrics
    case types.FETCH_METRICS_PENDING:
      return {
        ...state,
        metricsLoading: true,
        error: null
      }
    case types.FETCH_METRICS_FULFILLED:
      return {
        ...state,
        metricsLoading: false,
        metrics: {
          paidUsers: payload.data.allTimePaidUsers,
          totalRevenue: parseFloat(payload.data.allTimeTotalRevenue),
          churnRate: parseFloat(payload.data.allTimeChurnRate)
        },
        lastFetched: Date.now(),
        error: null
      }
    case types.FETCH_METRICS_REJECTED:
      return {
        ...state,
        metricsLoading: false,
        error: payload
      }

    // Level Statistics
    case types.FETCH_LEVEL_STATS_PENDING:
      return {
        ...state,
        levelStatsLoading: true,
        error: null
      }
    case types.FETCH_LEVEL_STATS_FULFILLED:
      return {
        ...state,
        levelStatsLoading: false,
        levelStatistics: {
          l1Learners: payload.data.levelBreakdown?.L1?.learnersCompleted || 0,
          l2Learners: payload.data.levelBreakdown?.L2?.learnersCompleted || 0,
          l3Learners: payload.data.levelBreakdown?.L3?.learnersCompleted || 0,
          avgDaysL1: payload.data.levelBreakdown?.L1?.avgDaysToComplete || 0,
          avgDaysL2: payload.data.levelBreakdown?.L2?.avgDaysToComplete || 0,
          avgDaysL3: payload.data.levelBreakdown?.L3?.avgDaysToComplete || 0,
          totalEnrolledLearners: payload.data.totalEnrolledLearners || 0,
          totalCompletedAIE: payload.data.completedAllLevels || 0,
          avgDaysAll: payload.data.avgDaysToCompleteAll || 0,
          portfolioStatistics: {
            portfoliosCreated: payload.data.portfolioStatistics?.portfoliosCreated || 0,
            totalCompletedPortfolios: payload.data.portfolioStatistics?.totalCompletedPortfolios || 0,
            completionRate: payload.data.portfolioStatistics?.completionRate || 0
          }
        },
        lastFetched: Date.now(),
        error: null
      }
    case types.FETCH_LEVEL_STATS_REJECTED:
      return {
        ...state,
        levelStatsLoading: false,
        error: payload
      }

    // Demographics
    case types.FETCH_DEMOGRAPHICS_PENDING:
      return {
        ...state,
        demographicsLoading: true,
        error: null
      }
    case types.FETCH_DEMOGRAPHICS_FULFILLED:
      return {
        ...state,
        demographicsLoading: false,
        demographics: {
          genderDistribution: payload.data.genderDistribution,
          ageDistribution: payload.data.ageDistribution,
          countryDistribution: payload.data.countryDistribution
        },
        lastFetched: Date.now(),
        error: null
      }
    case types.FETCH_DEMOGRAPHICS_REJECTED:
      return {
        ...state,
        demographicsLoading: false,
        error: payload
      }

    // User Status
    case types.FETCH_USER_STATUS_PENDING:
      return {
        ...state,
        userStatusLoading: true,
        error: null
      }
    case types.FETCH_USER_STATUS_FULFILLED:
      return {
        ...state,
        userStatusLoading: false,
        userStatus: {
          trials: payload.data.trials,
          paid: payload.data.paid,
          cancelled: payload.data.cancelled
        },
        lastFetched: Date.now(),
        error: null
      }
    case types.FETCH_USER_STATUS_REJECTED:
      return {
        ...state,
        userStatusLoading: false,
        error: payload
      }

    // Analytics
    case types.FETCH_ANALYTICS_PENDING:
      return {
        ...state,
        analyticsLoading: true,
        error: null
      }
    case types.FETCH_ANALYTICS_FULFILLED:
      return {
        ...state,
        analyticsLoading: false,
        analytics: payload.data,
        lastFetched: Date.now(),
        error: null
      }
    case types.FETCH_ANALYTICS_REJECTED:
      return {
        ...state,
        analyticsLoading: false,
        error: payload
      }

    // Revenue Analytics
    case types.FETCH_REVENUE_ANALYTICS_PENDING:
      return {
        ...state,
        revenueAnalyticsLoading: true,
        error: null
      }
    case types.FETCH_REVENUE_ANALYTICS_FULFILLED:
      return {
        ...state,
        revenueAnalyticsLoading: false,
        revenueAnalytics: {
          paidUsersData: payload.data.paidUsersOverTime.map(item => ({
            label: item.label,
            value: item.value
          })),
          revenueData: payload.data.revenueOverTime.map(item => ({
            label: item.label,
            value: parseFloat(item.value)
          }))
        },
        lastFetched: Date.now(),
        error: null
      }
    case types.FETCH_REVENUE_ANALYTICS_REJECTED:
      return {
        ...state,
        revenueAnalyticsLoading: false,
        error: payload
      }

    // Clear Cache
    case types.CLEAR_ADMIN_DASHBOARD_CACHE:
      return initialState

    default:
      return state
  }
}

export default adminDashboardReducer