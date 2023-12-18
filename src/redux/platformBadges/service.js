import axiosInstance from '../../utils/AxiosInstance'

const fetchWatchedMasterClassVidoes = async (studentID) => {
  try {
    const response = await axiosInstance.get(
      `/contents/video/interaction/${studentID}`
    )

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch watched masterclass videos')
    }
  } catch (error) {
    throw error
  }
}

const fetchWatchedPodcastVidoes = async (studentID) => {
  try {
    const response = await axiosInstance.get(
      `/podcast/video/interaction/${studentID}`
    )

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch watched podcast videos')
    }
  } catch (error) {
    throw error
  }
}

const fetchProfficientIamrSkills = async (studentID) => {
  try {
    const response = await axiosInstance.get(`/iamr/skills/user/${studentID}`)

    if (response.status === 200) {
      const filteredSkills = response.data.skills.filter((skill) => {
        const { SkillStatus } = skill

        if (SkillStatus && SkillStatus.status) {
          return (
            SkillStatus.status === 'approved' ||
            SkillStatus.status === 'proficient'
          )
        }

        return false
      })

      return filteredSkills.length > 0 ? filteredSkills : []
    } else {
      throw new Error('Failed to fetch IAMR skills')
    }
  } catch (error) {
    throw error
  }
}

const fetchCompletedJournals = async (studentID) => {
  try {
    const response = await axiosInstance.get(
      `/ltsJournals/platformBadges/journal/student/${studentID}`
    )
    if (response.status === 200) {
      const completedJournals = response.data.filter(
        (journal) => journal.completed
      )
      return completedJournals
    } else {
      throw new Error('Failed to create watched masterclass videos')
    }
  } catch (error) {
    throw error
  }
}

const fetchCompletedSprints = async (studentID) => {
  try {
    const response = await axiosInstance.get(
      `/ltsJournals/platformBadges/journal/sprintsCompleted/${studentID}`
    )

    if (response.status === 200) {
      const completedSprints = response.data.filter((item) => item.completed)
      return completedSprints
    }
  } catch (error) {
    throw error
  }
}

const fetchCompletedFeedbacks = async (studentID) => {
  try {
    const response = await axiosInstance.get(
      `/feedbacks/platformBadges/${studentID}`
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchCompletedMentorMeetings = async (studentID) => {
  try {
    const response = await axiosInstance.get(
      `/mentorMeetings/platformBadges/${studentID}`
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}

const fetchCompletedPortfolioContent = async (studentID) => {
  try {
    const response = await axiosInstance.get(
      `/users/submissions/user/${studentID}`
    )
    if (response.status === 200) {
      return response.data.submissions
    }
  } catch (error) {
    throw error
  }
}

const platformBadgesService = {
  fetchWatchedMasterClassVidoes,
  fetchWatchedPodcastVidoes,
  fetchProfficientIamrSkills,
  fetchCompletedJournals,
  fetchCompletedSprints,
  fetchCompletedFeedbacks,
  fetchCompletedMentorMeetings,
  fetchCompletedPortfolioContent
}

export default platformBadgesService
