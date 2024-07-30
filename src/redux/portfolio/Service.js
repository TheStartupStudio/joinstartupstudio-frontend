import axiosInstance from '../../utils/AxiosInstance'

export const getPublicPortfolioAPI = async () => {
  try {
    const response = await axiosInstance.get('/sharingSettings')
    return response
  } catch (e) {
    throw new Error('Error occurred during fetching user portfolio', e)
  }
}
export const getSharingSettingsAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/sharingSettings')
    return response
  } catch (e) {
    throw new Error('Error occurred during fetching user story', e)
  }
}

export const updateSharingSettingsAPI = async (userSharingSettings) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/sharingSettings/${userSharingSettings.id}`,
      userSharingSettings
    )
    return response
  } catch (e) {
    console.log('error', e)
    throw Error('Error occurred during sharing user story', e)
  }
}
export const createSharingSettingsAPI = async (userSharingSettings) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/sharingSettings',
      userSharingSettings
    )
    return response
  } catch (e) {
    console.log('Error occurred during fetching user story', e)
  }
}

export const getUserStoryAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/userStory')
    return response
  } catch (e) {
    console.log('Error occurred during fetching user story', e)
  }
}

export const createUserStoryAPI = async (userStory) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/userStory',
      userStory
    )

    return response
  } catch (e) {
    console.log('Error occurred during creating user story', e)
  }
}

export const updateUserStoryAPI = async (userStory, id) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/userStory/${id}`,
      userStory
    )
    return response
  } catch (e) {
    console.log('Error occurred during updating user story', e)
  }
}

export const getMyRelationshipsAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/myRelationships')

    return response
  } catch (e) {
    console.log('Error occurred during fetching my relationships', e)
  }
}

export const createMyRelationshipsAPI = async (myRelationships) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/myRelationships',
      myRelationships
    )

    return response
  } catch (e) {
    console.log('Error occurred during creating my relationships', e)
  }
}

export const updateMyRelationshipsAPI = async (myRelationships, id) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/userStory/${id}`,
      myRelationships
    )
    return response
  } catch (e) {
    console.log('Error occurred during updating my relationships', e)
  }
}

export const getMyFailuresAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/myFailures')
    return response
  } catch (e) {
    console.log('Error occurred during fetching my relationships', e)
  }
}

export const createMyFailuresAPI = async (myFailures) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/myFailures',
      myFailures
    )

    return response
  } catch (e) {
    console.log('Error occurred during creating my relationships', e)
  }
}

export const updateMyFailuresAPI = async (myFailures, id) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/myFailures/${id}`,
      myFailures
    )

    return response
  } catch (e) {
    console.log('Error occurred during creating my relationships', e)
  }
}

export const deleteMyFailuresAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/hsPortfolio/myFailures/${id}`)

    return response
  } catch (e) {
    console.log('Error occurred during creating my failure', e)
  }
}

export const getMyMentorsAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/myMentors')
    return response
  } catch (e) {
    console.log('Error occurred during fetching my mentors', e)
  }
}

export const createMyMentorsAPI = async (myMentors) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/myMentors',
      myMentors
    )

    return response
  } catch (e) {
    console.log('Error occurred during creating my mentor', e)
  }
}

export const updateMyMentorsAPI = async (myMentors, id) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/myMentors/${id}`,
      myMentors
    )

    return response
  } catch (e) {
    console.log('Error occurred during creating my mentor', e)
  }
}

export const deleteMyMentorsAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(`/hsPortfolio/myMentors/${id}`)

    return response
  } catch (e) {
    console.log('Error occurred during creating my mentor', e)
  }
}
//////////////// WHAT CAN I DO SECTION /////////////////

export const getSkillsAPI = async () => {
  try {
    const response = await axiosInstance.get('/iamr/skills/')
    return response
  } catch (e) {
    console.log('Error occurred during fetching my mentors', e)
  }
}

export const getMyProjectsAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/myProjects')
    return response
  } catch (e) {
    console.log('Error occurred during fetching my mentors', e)
  }
}

////////////// HOW DO I PROVE IT //////////////////

export const getMyEducationsAPI = async () => {
  try {
    const response = await axiosInstance.get(
      `/hsPortfolio/workEducations/${'education'}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during fetching educations', e)
  }
}

export const updateMyEducationAPI = async (education) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/workEducations/${'education'}/${education.id}`,
      education
    )
    return response
  } catch (e) {
    console.log('Error occurred during updating education', e)
  }
}

export const addMyEducationAPI = async (education) => {
  try {
    const response = await axiosInstance.post('/hsPortfolio/workEducations', {
      ...education,
      type: 'education'
    })
    return response
  } catch (e) {
    console.log('Error occurred during adding education', e)
  }
}

export const deleteMyEducationAPI = async (educationId) => {
  try {
    const response = await axiosInstance.delete(
      `/hsPortfolio/workEducations/${educationId}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during deleting education', e)
  }
}

export const getMyCredentialsAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/credentials')
    return response
  } catch (e) {
    console.log('Error occurred during fetching credentials', e)
  }
}

export const updateMyCredentialAPI = async (credential) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/credentials/${credential.id}`,
      credential
    )
    return response
  } catch (e) {
    console.log('Error occurred during updating credential', e)
  }
}

export const addMyCredentialAPI = async (credential) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/credentials',
      credential
    )
    return response
  } catch (e) {
    console.log('Error occurred during adding credential', e)
  }
}

export const deleteMyCredentialAPI = async (credentialId) => {
  try {
    const response = await axiosInstance.delete(
      `/hsPortfolio/credentials/${credentialId}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during deleting credential', e)
  }
}

export const getMyImmersionsAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/immersions')
    return response
  } catch (e) {
    console.log('Error occurred during fetching immersions', e)
  }
}

export const updateMyImmersionAPI = async (immersion) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/immersions/${immersion.id}`,
      immersion
    )
    return response
  } catch (e) {
    console.log('Error occurred during updating immersion', e)
  }
}

export const addMyImmersionAPI = async (immersion) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/immersions',
      immersion
    )
    return response
  } catch (e) {
    console.log('Error occurred during adding immersion', e)
  }
}

export const deleteMyImmersionAPI = async (immersionId) => {
  try {
    const response = await axiosInstance.delete(
      `/hsPortfolio/immersions/${immersionId}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during deleting immersion', e)
  }
}

export const getWorkExperiencesAPI = async () => {
  try {
    const response = await axiosInstance.get(
      `/hsPortfolio/workEducations/${'work'}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during fetching work experiences', e)
  }
}

export const updateWorkExperienceAPI = async (education) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/workEducations/${'work'}/${education.id}`,
      education
    )
    return response
  } catch (e) {
    console.log('Error occurred during updating work', e)
  }
}

export const addWorkExperienceAPI = async (education) => {
  try {
    const response = await axiosInstance.post('/hsPortfolio/workEducations', {
      ...education,
      type: 'work'
    })
    return response
  } catch (e) {
    console.log('Error occurred during adding work', e)
  }
}

export const deleteWorkExperienceAPI = async (educationId) => {
  try {
    const response = await axiosInstance.delete(
      `/hsPortfolio/workEducations/${educationId}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during deleting education', e)
  }
}

export const getMyCompetitivenessAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/myCompetitiveness')
    return response
  } catch (e) {
    console.log('Error occurred during fetching my competitiveness', e)
  }
}

export const createMyCompetitivenessAPI = async (myCompetitiveness) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/myCompetitiveness',
      myCompetitiveness
    )

    return response
  } catch (e) {
    console.log('Error occurred during creating my competitiveness', e)
  }
}

export const updateMyCompetitivenessAPI = async (myCompetitiveness, id) => {
  try {
    const response = await axiosInstance.put(
      `/hsPortfolio/myCompetitiveness/${id}`,
      myCompetitiveness
    )
    return response
  } catch (e) {
    console.log('Error occurred during creating my competitiveness', e)
  }
}

export const deleteMyCompetitivenessAPI = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/hsPortfolio/myCompetitiveness/${id}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during creating my competitiveness', e)
  }
}
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// await delay(2000)
