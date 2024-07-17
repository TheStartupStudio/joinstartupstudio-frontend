import axiosInstance from '../../utils/AxiosInstance'

export const getPortfolioPrivacyAPI = async () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  await delay(2000)

  return {
    data: {
      publishToPeers: false,
      publishToPublic: true
    }
  }
}

export const updatePortfolioPrivacyAPI = async (userPrivacy) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  await delay(2000)

  return {
    data: userPrivacy
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
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// await delay(2000)
