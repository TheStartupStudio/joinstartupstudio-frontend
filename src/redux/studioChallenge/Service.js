import axiosInstance from '../../utils/AxiosInstance'

export const getChallengeProgress = () =>
  axiosInstance.get('/challenge/progress')
