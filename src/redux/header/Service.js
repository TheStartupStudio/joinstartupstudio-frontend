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
export const editBriefing = async (briefing, briefingId) => {
  const response = await axiosInstance.patch(
    `/briefings/${briefingId}`,
    briefing
  )
  return response.data
}

export const createBriefing = async (briefing) => {
  const response = await axiosInstance.post('/briefings', briefing)
  return response.data
}

export const deleteBriefing = async (briefingID) => {
  const response = await axiosInstance.delete(`/briefings/${briefingID}`)
  return { ...response.data, briefingID }
}
export const updateSelectedBriefingInArray = (briefings, selectedBriefing) => {
  return briefings.map((briefing) =>
    briefing.id === selectedBriefing.id
      ? { ...briefing, isSelected: true }
      : { ...briefing, isSelected: false }
  )
}
export const updatedBriefingInArray = (briefings, updatedBriefing) => {
  return briefings.map((briefing) =>
    briefing.id === updatedBriefing.id ? updatedBriefing : briefing
  )
}
