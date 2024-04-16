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

const fetchIndustryProblems = async (currentPage, itemsPerPage) => {
  try {
    const response = await axiosInstance.get(
      `/immersion/problems?page=${currentPage}&limit=${itemsPerPage}`
    )
    console.log('response', response)
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
    console.log('response', response)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const myImmersionService = {
  fetchStep,
  fetchIndustryProblems,
  fetchExperiences,
  fetchAllIndustries
}

export default myImmersionService
