import axiosInstance from '../../utils/AxiosInstance'

const fetchLessons = async () => {
  try {
    const response = await axiosInstance.get(`/lessons`)

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const editLesson = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/lessons/${id}`, data)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const createLesson = async (data) => {
  try {
    const response = await axiosInstance.post(`/lessons`, data)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const deleteLesson = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lessons/${id}`)
    if (response.status === 200) {
      return { ...response.data, id }
    }
  } catch (error) {
    throw error
  }
}

export const updatedLesson = (briefings, updatedBriefing) => {
  return briefings.map((briefing) =>
    briefing.id === updatedBriefing.id ? updatedBriefing : briefing
  )
}

const taskLessonService = {
  fetchLessons,
  editLesson,
  createLesson,
  deleteLesson
}
export default taskLessonService
