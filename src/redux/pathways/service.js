import axiosInstance from '../../utils/AxiosInstance'

const fetchOccupationGroups = async () => {
  try {
    const response = await axiosInstance.get(`/pathways/occupation-groups`)

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchOccupationGroupWithID = async (occupationGroupID) => {
  try {
    const response = await axiosInstance.get(
      `/pathways/occupation-groups/${occupationGroupID}`
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchOccupationJobsBasedOnGroupId = async (occupationGroupID) => {
  try {
    const response = await axiosInstance.get(
      `/pathways/occupation-jobs/${occupationGroupID}`
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchOccupationJobWithID = async (occupationJobID) => {
  try {
    const response = await axiosInstance.get(
      `/pathways/occupation-jobs/job/${occupationJobID}`
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const PathwaysService = {
  fetchOccupationGroups,
  fetchOccupationGroupWithID,
  fetchOccupationJobsBasedOnGroupId,
  fetchOccupationJobWithID
}

export default PathwaysService
