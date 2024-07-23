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

////////////// HOW DO I PROVE IT ///////////////////////

export const getMyEducationsAPI = async () => {
  try {
    const response = await axiosInstance.get(
      `/hsPortfolio/workEducations/${'education'}`
    )
    return response
    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    // await delay(2000)
    //
    // const data = [
    //   {
    //     id: 1,
    //     imageUrl: null,
    //     startDate: '2020-09-01',
    //     endDate: '2024-06-01',
    //     organizationName: 'University A',
    //     location: 'City A',
    //     website: 'https://universitya.edu',
    //     description: 'Bachelor of Science in Computer Science',
    //     currentPosition: false
    //   },
    //   {
    //     id: 2,
    //     imageUrl: null,
    //     startDate: '2016-09-01',
    //     endDate: '2020-06-01',
    //     organizationName: 'High School B',
    //     location: 'City B',
    //     website: 'https://highschoolb.edu',
    //     description: 'High School Diploma',
    //     currentPosition: false
    //   },
    //   {
    //     id: 3,
    //     imageUrl: null,
    //     startDate: '2024-09-01',
    //     endDate: '2026-06-01',
    //     organizationName: 'Graduate School C',
    //     location: 'City C',
    //     website: 'https://graduateschoolc.edu',
    //     description: 'Master of Science in Artificial Intelligence',
    //     currentPosition: false
    //   },
    //   {
    //     id: 4,
    //     imageUrl: null,
    //     startDate: '2014-09-01',
    //     endDate: '2016-06-01',
    //     organizationName: 'Community College D',
    //     location: 'City D',
    //     website: 'https://communitycolleged.edu',
    //     description: 'Associate Degree in Information Technology',
    //     currentPosition: false
    //   },
    //   {
    //     id: 5,
    //     imageUrl: null,
    //     startDate: '2026-09-01',
    //     endDate: '2029-06-01',
    //     organizationName: 'PhD Program E',
    //     location: 'City E',
    //     website: 'https://phdprograme.edu',
    //     description: 'Doctor of Philosophy in Robotics',
    //     currentPosition: true
    //   }
    // ]
    // return { data }
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
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(2000)
    const data = [
      {
        id: 1,
        organizationLogo: 'https://example.com/logo1.png',
        startDate: '2021-01-01',
        endDate: '2021-06-30',
        organizationName: 'Tech Innovators',
        location: 'San Francisco, CA',
        website: 'https://techinnovators.com',
        problem: 'Limited access to advanced technology in rural areas.',
        solution:
          'Developed mobile tech labs to bring advanced technology to rural communities.',
        currentlyAttending: false,
        immersionThumbnailUrl: 'https://example.com/thumbnail1.png',
        immersionVideoUrl: 'https://example.com/video1.mp4'
      },
      {
        id: 2,
        organizationLogo: 'https://example.com/logo2.png',
        startDate: '2020-03-01',
        endDate: '2020-12-31',
        organizationName: 'Health First',
        location: 'New York, NY',
        website: 'https://healthfirst.com',
        problem: 'High rates of preventable diseases.',
        solution:
          'Launched a city-wide health awareness campaign and free health check-ups.',
        currentlyAttending: false,
        immersionThumbnailUrl: 'https://example.com/thumbnail2.png',
        immersionVideoUrl: 'https://example.com/video2.mp4'
      },
      {
        id: 3,
        organizationLogo: 'https://example.com/logo3.png',
        startDate: '2022-07-01',
        endDate: '',
        organizationName: 'Green Earth Initiative',
        location: 'Austin, TX',
        website: 'https://greenearth.com',
        problem: 'Increasing pollution levels.',
        solution: 'Implemented urban gardening and recycling programs.',
        currentlyAttending: true,
        immersionThumbnailUrl: 'https://example.com/thumbnail3.png',
        immersionVideoUrl: 'https://example.com/video3.mp4'
      },
      {
        id: 4,
        organizationLogo: 'https://example.com/logo4.png',
        startDate: '2019-05-15',
        endDate: '2020-02-20',
        organizationName: 'EduGrowth',
        location: 'Seattle, WA',
        website: 'https://edugrowth.com',
        problem: 'Low literacy rates in underserved communities.',
        solution: 'Provided free tutoring and educational resources.',
        currentlyAttending: false,
        immersionThumbnailUrl: 'https://example.com/thumbnail4.png',
        immersionVideoUrl: 'https://example.com/video4.mp4'
      },
      {
        id: 5,
        organizationLogo: 'https://example.com/logo5.png',
        startDate: '2023-04-01',
        endDate: '',
        organizationName: 'Clean Water Project',
        location: 'Denver, CO',
        website: 'https://cleanwater.com',
        problem: 'Lack of access to clean drinking water.',
        solution: 'Installed water purification systems in affected areas.',
        currentlyAttending: true,
        immersionThumbnailUrl: 'https://example.com/thumbnail5.png',
        immersionVideoUrl: 'https://example.com/video5.mp4'
      }
    ]
    return { data: data }
    // const response = await axiosInstance.get('/hsPortfolio/immersions')
    // return response
  } catch (e) {
    console.log('Error occurred during fetching immersions', e)
  }
}

export const updateMyImmersionAPI = async (immersion) => {
  try {
    const response = await axiosInstance.put(
      '/hsPortfolio/immersions',
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

export const getMyWorkExperiencesAPI = async () => {
  try {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(2000)
    const data = [
      {
        id: 1,
        organizationName: 'Tech Innovators',
        location: 'San Francisco, CA',
        website: 'https://techinnovators.com',
        startDate: '2021-01-01',
        endDate: '2021-06-30',
        description:
          'Worked on developing mobile tech labs to bring advanced technology to rural communities.',
        imageUrl: 'https://example.com/logo1.png',
        currentPosition: false
      },
      {
        id: 2,
        organizationName: 'Health First',
        location: 'New York, NY',
        website: 'https://healthfirst.com',
        startDate: '2020-03-01',
        endDate: '2020-12-31',
        description:
          'Launched a city-wide health awareness campaign and organized free health check-ups.',
        imageUrl: 'https://example.com/logo2.png',
        currentPosition: false
      },
      {
        id: 3,
        organizationName: 'Green Earth Initiative',
        location: 'Austin, TX',
        website: 'https://greenearth.com',
        startDate: '2022-07-01',
        endDate: '',
        description:
          'Implemented urban gardening and recycling programs to combat pollution.',
        imageUrl: 'https://example.com/logo3.png',
        currentPosition: true
      },
      {
        id: 4,
        organizationName: 'EduGrowth',
        location: 'Seattle, WA',
        website: 'https://edugrowth.com',
        startDate: '2019-05-15',
        endDate: '2020-02-20',
        description:
          'Provided free tutoring and educational resources to underserved communities.',
        imageUrl: 'https://example.com/logo4.png',
        currentPosition: false
      },
      {
        id: 5,
        organizationName: 'Clean Water Project',
        location: 'Denver, CO',
        website: 'https://cleanwater.com',
        startDate: '2023-04-01',
        endDate: '',
        description:
          'Installed water purification systems in areas lacking access to clean drinking water.',
        imageUrl: 'https://example.com/logo5.png',
        currentPosition: true
      }
    ]
    return { data: data }
    // const response = await axiosInstance.get('/hsPortfolio/work_experience')
    // return response
  } catch (e) {
    console.log('Error occurred during fetching work experience', e)
  }
}

export const updateMyWorkExperienceAPI = async (workExperience) => {
  try {
    const response = await axiosInstance.put(
      '/hsPortfolio/work_experience',
      workExperience
    )
    return response
  } catch (e) {
    console.log('Error occurred during updating work experience', e)
  }
}

export const addMyWorkExperienceAPI = async (workExperience) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/work_experience',
      workExperience
    )
    return response
  } catch (e) {
    console.log('Error occurred during adding work experience', e)
  }
}

export const deleteMyWorkExperienceAPI = async (workExperienceId) => {
  try {
    const response = await axiosInstance.delete(
      `/hsPortfolio/work_experience/${workExperienceId}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during deleting work experience', e)
  }
}

export const getMyCompetitivenessAPI = async () => {
  try {
    const response = await axiosInstance.get('/hsPortfolio/competitiveness')
    return response
  } catch (e) {
    console.log('Error occurred during fetching competitiveness', e)
  }
}

export const updateMyCompetitivenessAPI = async (competitiveness) => {
  try {
    const response = await axiosInstance.put(
      '/hsPortfolio/competitiveness',
      competitiveness
    )
    return response
  } catch (e) {
    console.log('Error occurred during updating competitiveness', e)
  }
}

export const addMyCompetitivenessAPI = async (competitiveness) => {
  try {
    const response = await axiosInstance.post(
      '/hsPortfolio/competitiveness',
      competitiveness
    )
    return response
  } catch (e) {
    console.log('Error occurred during adding competitiveness', e)
  }
}

export const deleteMyCompetitivenessAPI = async (competitivenessId) => {
  try {
    const response = await axiosInstance.delete(
      `/hsPortfolio/competitiveness/${competitivenessId}`
    )
    return response
  } catch (e) {
    console.log('Error occurred during deleting competitiveness', e)
  }
}
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// await delay(2000)
