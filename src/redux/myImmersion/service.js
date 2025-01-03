import axiosInstance from '../../utils/AxiosInstance'

const fetchStep = async (step) => {
  try {
    const response = await axiosInstance.get(`/immersion/steps/${step}`)

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchIndustryProblems = async (
  step,
  currentPage,
  itemsPerPage,
  industry
) => {
  try {
    const response = await axiosInstance.get(
      `/immersion/immersionsAll/fetch-immersion-step?step=${step}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}&industry=${industry}`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchSpotlights = async () => {
  try {
    const response = await axiosInstance.get(`/immersion/spotlights`)

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchAllIndustries = async () => {
  try {
    const response = await axiosInstance.get(`/immersion/industries`)

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchUserProblemSolution = async (user_ID, solution_ID) => {
  try {
    const response = await axiosInstance.get(
      `/immersion/problems/${user_ID}/${solution_ID}`
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchUserSpotlightApplication = async (user_ID, spotlight_ID) => {
  try {
    const response = await axiosInstance.get(
      `/immersion/spotlights/${user_ID}/${spotlight_ID}`
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const handleSpotlightStatus = async (id, status, feedbackMessage) => {
  try {
    const response = await axiosInstance.patch(`/immersion/spotlights/${id}`, {
      status,
      feedbackMessage
    })
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const handleIndustryProblemStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/immersion/problems/${id}`, {
      status
    })
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const createIndustryProblem = async (data) => {
  try {
    const response = await axiosInstance.post('/immersion/problems', data)

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const createSpotlight = async (data) => {
  try {
    const response = await axiosInstance.post('/immersion/spotlights', data)

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const updateStatusInArray = (array, selectedItem, status) => {
  return array.map((item) =>
    item.id === selectedItem.id
      ? { ...item, status: status }
      : { ...item, isSelected: false }
  )
}

const myImmersionService = {
  fetchStep,
  fetchIndustryProblems,
  fetchSpotlights,
  fetchAllIndustries,
  fetchUserProblemSolution,
  fetchUserSpotlightApplication,
  handleSpotlightStatus,
  handleIndustryProblemStatus,
  updateStatusInArray,
  createIndustryProblem,
  createSpotlight
}

export default myImmersionService
