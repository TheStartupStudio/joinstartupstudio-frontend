import axiosInstance from '../../utils/AxiosInstance'

export const getStreakSummary = () => axiosInstance.get('/streak')
