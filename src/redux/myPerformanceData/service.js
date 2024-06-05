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
const fetchInstructorSectionOne = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/sectionOne/${id}`
    )
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
const fetchInstructorSectionTwo = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/sectionTwo/${id}`
    )
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
const fetchInstructorCertificateData = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/sectionTwo/certification/${id}`
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
const fetchInstructorDebriefDataWithId = async (curriculumCompletion, id) => {
  console.log('curriculumCompletion', curriculumCompletion)
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/sectionThree/${curriculumCompletion}/instructorDebriefData/${id}`
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
const fetchInstructorMasterclassPercentage = async (year, id) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/video/${year}/masterclass/${id}`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const fetchInstructorPodcastPercentage = async (year, id) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/video/${year}/podcast/${id}`
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const fetchInstructorQAPercentage = async (year, id) => {
  try {
    const response = await axiosInstance.get(
      `/myPerformanceData/video/${year}/Q&A/${id}`
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
  fetchQAPercentage,

  fetchInstructorSectionOne,
  fetchInstructorSectionTwo,
  fetchInstructorCertificateData,
  fetchInstructorDebriefDataWithId,
  fetchInstructorMasterclassPercentage,
  fetchInstructorPodcastPercentage,
  fetchInstructorQAPercentage
}

export default performanceDataService
