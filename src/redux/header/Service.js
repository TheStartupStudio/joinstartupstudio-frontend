import axiosInstance from '../../utils/AxiosInstance'

export const getBriefings = async () => {
  const response = await axiosInstance.get('/briefing')
  return response
}

export const postBriefing = async (briefing) => {
  const response = await axiosInstance.post('/briefing', briefing)
  return response
}

export const editBriefing = async (briefing, briefingId) => {
  const response = await axiosInstance.put(`/briefing/${briefingId}`, briefing)
  return response
}

export const deleteBriefing = async (briefingId) => {
  const response = await axiosInstance.delete(`/briefing/${briefingId}`)
  return response
}
