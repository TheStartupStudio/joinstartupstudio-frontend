import axiosInstance from '../../utils/AxiosInstance'

const adminDashboardService = {
  fetchMetrics: async () => {
    try {
      const response = await axiosInstance.get('/admin-info/metrics')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      throw error
    }
  },

  fetchLevelStatistics: async () => {
    try {
      const response = await axiosInstance.get('/admin-info/level-statistics')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      throw error
    }
  },

  fetchDemographicStatistics: async () => {
    try {
      const response = await axiosInstance.get('/admin-info/demographic-statistics')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      throw error
    }
  },

  fetchUserStatus: async () => {
    try {
      const response = await axiosInstance.get('/admin-info/user-status')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      throw error
    }
  },

  fetchAnalytics: async () => {
    try {
      const response = await axiosInstance.get('/admin-info/analytics')
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      throw error
    }
  },

  fetchRevenueAnalytics: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get('/admin-info/revenue-analytics', {
        params: { startDate, endDate }
      })
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      throw error
    }
  }
}

export default adminDashboardService