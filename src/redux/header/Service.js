import axiosInstance from '../../utils/AxiosInstance'

export const getBriefings = async () => {
  const response = await axiosInstance.get('/briefings')
  return response
}

export const getSelectedBriefing = async () => {
  const response = await axiosInstance.get(`/briefings/selectedBriefing`)
  return response.data
}

export const updateSelectedBriefing = async (briefingID) => {
  const response = await axiosInstance.patch(
    `/briefings/selectedBriefing/${briefingID}`
  )
  return response.data
}

export const postBriefing = async (briefing) => {
  const response = await axiosInstance.post('/briefings', briefing)
  return response
}

export const editBriefing = async (briefing, briefingId) => {
  const response = await axiosInstance.put(`/briefings/${briefingId}`, briefing)
  return response
}

export const deleteBriefing = async (briefingId) => {
  const response = await axiosInstance.delete(`/briefings/${briefingId}`)
  return response
}
export const updateBriefingInArray = (briefings, selectedBriefing) => {
  return briefings.map((briefing) =>
    briefing.id === selectedBriefing.id
      ? { ...briefing, isSelected: true }
      : { ...briefing, isSelected: false }
  )
}
