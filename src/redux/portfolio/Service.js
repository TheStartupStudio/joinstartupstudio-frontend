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
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(2000)

    const data = [
      {
        id: 1,
        credentialTitle: 'Certified JavaScript Developer',
        dateAwarded: '2023-06-15',
        certifyingOrganization: 'JavaScript Institute',
        website: 'https://www.javascriptinstitute.com',
        imageUrl:
          'https://www.javascriptinstitute.com/images/certified_js_developer.png',
        description:
          'Certification awarded for demonstrating expertise in JavaScript programming and development.'
      },
      {
        id: 2,
        credentialTitle: 'AWS Certified Solutions Architect',
        dateAwarded: '2022-09-10',
        certifyingOrganization: 'Amazon Web Services',
        website:
          'https://aws.amazon.com/certification/certified-solutions-architect/',
        imageUrl:
          'https://aws.amazon.com/images/certified_solutions_architect.png',
        description:
          'Certification awarded for demonstrating expertise in designing and deploying scalable systems on AWS.'
      },
      {
        id: 3,
        credentialTitle: 'Certified Data Science Professional',
        dateAwarded: '2021-12-01',
        certifyingOrganization: 'Data Science Council of America',
        website: 'https://www.datasciencecouncil.com',
        imageUrl:
          'https://www.datasciencecouncil.com/images/certified_data_science_professional.png',
        description:
          'Certification awarded for demonstrating knowledge in data analysis, machine learning, and statistical methods.'
      },
      {
        id: 4,
        credentialTitle: 'Google Cloud Professional Data Engineer',
        dateAwarded: '2023-03-22',
        certifyingOrganization: 'Google Cloud',
        website: 'https://cloud.google.com/certification/data-engineer',
        imageUrl:
          'https://cloud.google.com/images/professional_data_engineer.png',
        description:
          'Certification awarded for expertise in building and maintaining data structures and databases on Google Cloud.'
      },
      {
        id: 5,
        credentialTitle: 'PMP: Project Management Professional',
        dateAwarded: '2022-05-18',
        certifyingOrganization: 'Project Management Institute',
        website: 'https://www.pmi.org/certifications/project-management-pmp',
        imageUrl: 'https://www.pmi.org/images/pmp_certification.png',
        description:
          'Certification awarded for demonstrating the skills and knowledge required to manage projects effectively.'
      }
    ]

    return { data }

    // const response = await axiosInstance.get('/hsPortfolio/credentials')
    // return response
  } catch (e) {
    console.log('Error occurred during fetching credentials', e)
  }
}

export const updateMyCredentialAPI = async (credential) => {
  try {
    const response = await axiosInstance.put(
      '/hsPortfolio/credentials',
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
    const response = await axiosInstance.get('/hsPortfolio/work_experience')
    return response
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
