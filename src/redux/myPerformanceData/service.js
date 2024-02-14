import axiosInstance from '../../utils/AxiosInstance'

const fetchSectionOne = async () => {
  try {
    const response = await axiosInstance.get(`/myPerformanceData/sectionOne`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const fetchSectionTwo = async () => {
  try {
    const response = await axiosInstance.get(`/myPerformanceData/sectionTwo`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const fetchCertificateData = async () => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/sectionTwo/certification`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const fetchInstructorDebriefData = async (curriculumCompletion) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/sectionThree/${curriculumCompletion}/instructorDebriefData`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchMasterclassPercentage = async (year) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/video/${year}/masterclass`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const fetchPodcastPercentage = async (year) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/video/${year}/podcast`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const fetchQAPercentage = async (year) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/video/${year}/Q&A`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const performanceDataService = {
  fetchSectionOne,
  fetchSectionTwo,
  fetchCertificateData,
  fetchInstructorDebriefData,
  fetchMasterclassPercentage,
  fetchPodcastPercentage,
  fetchQAPercentage
}

export default performanceDataService
