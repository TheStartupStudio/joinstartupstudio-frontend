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

const fetchIndustryProblems = async (step, currentPage, itemsPerPage) => {
  try {
    const response = await axiosInstance.get(
      `/immersion/immersionsAll/fetch-immersion-step?step=${step}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchExperiences = async (currentPage, itemsPerPage) => {
  try {
    const response = await axiosInstance.get(
      `/immersion/experiences?page=${currentPage}&limit=${itemsPerPage}`
    )

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

const fetchUserExperienceApplication = async (user_ID, experience_ID) => {
  try {
    const response = await axiosInstance.get(
      `/immersion/experiences/${user_ID}/${experience_ID}`
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const handleExperienceStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/immersion/experiences/${id}`, {
      status
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
  fetchExperiences,
  fetchAllIndustries,
  fetchUserProblemSolution,
  fetchUserExperienceApplication,
  handleExperienceStatus,
  handleIndustryProblemStatus,
  updateStatusInArray
}

export default myImmersionService
