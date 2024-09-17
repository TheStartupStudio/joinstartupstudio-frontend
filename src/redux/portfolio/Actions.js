import {
  CHANGE_ACTIVE_SECTION,
  CHANGE_ACTIVE_SECTION_SUCCESS,
  CHANGE_VIEW_MODE,
  CHANGE_VIEW_MODE_SUCCESS,
  CHANGE_VIEW_MODE_ERROR,
  PUBLISH_PORTFOLIO_SECTION,
  PUBLISH_PORTFOLIO_SECTION_SUCCESS,
  PUBLISH_PORTFOLIO_SECTION_ERROR,
  SHARE_PORTFOLIO_SECTION,
  SHARE_PORTFOLIO_SECTION_SUCCESS,
  SHARE_PORTFOLIO_SECTION_ERROR,
  EDIT_MY_RELATIONSHIP,
  EDIT_MY_RELATIONSHIP_SUCCESS,
  EDIT_MY_RELATIONSHIP_ERROR,
  EDIT_MY_FAILURES,
  EDIT_MY_FAILURES_SUCCESS,
  EDIT_MY_FAILURES_ERROR,
  EDIT_MY_MENTORS,
  EDIT_MY_MENTORS_SUCCESS,
  EDIT_MY_MENTORS_ERROR,
  EDIT_WHO_SECTION,
  EDIT_WHO_SECTION_SUCCESS,
  SAVE_PERSONAL_BRAND_STORY,
  SAVE_PERSONAL_BRAND_STORY_SUCCESS,
  SAVE_USER_STORY,
  SAVE_USER_STORY_SUCCESS,
  GET_USER_STORY_SUCCESS,
  GET_MY_RELATIONSHIPS,
  GET_MY_RELATIONSHIPS_SUCCESS,
  SAVE_MY_RELATIONSHIPS,
  SAVE_MY_RELATIONSHIPS_SUCCESS,
  GET_MY_FAILURES,
  GET_MY_FAILURES_SUCCESS,
  CREATE_MY_FAILURE,
  CREATE_MY_FAILURE_SUCCESS,
  CREATE_MY_FAILURE_ERROR,
  UPDATE_MY_FAILURE,
  UPDATE_MY_FAILURE_SUCCESS,
  UPDATE_MY_FAILURE_ERROR,
  SAVE_MY_FAILURES,
  SAVE_MY_FAILURES_SUCCESS,
  GET_MY_MENTORS,
  GET_MY_MENTORS_SUCCESS,
  SAVE_MY_MENTORS,
  SAVE_MY_MENTORS_SUCCESS,
  UPDATE_SHARING_SETTINGS,
  UPDATE_SHARING_SETTINGS_SUCCESS,
  GET_SHARING_SETTINGS,
  GET_SHARING_SETTINGS_SUCCESS,
  SET_VISIBILITY_MODAL,
  SET_VISIBILITY_MODAL_SUCCESS,
  SET_VISIBILITY_MODAL_CONTENT,
  SET_VISIBILITY_MODAL_CONTENT_SUCCESS,
  SET_SHARE_MODAL,
  SET_SHARE_MODAL_SUCCESS,
  SET_SHARE_MODAL_CONTENT,
  SET_SHARE_MODAL_CONTENT_SUCCESS,
  SET_PUBLISH_MODAL,
  SET_PUBLISH_MODAL_SUCCESS,
  UPDATE_MY_MENTOR_SUCCESS,
  UPDATE_MY_MENTOR_ERROR,
  UPDATE_MY_MENTOR,
  CREATE_MY_MENTOR_ERROR,
  CREATE_MY_MENTOR_SUCCESS,
  CREATE_MY_MENTOR,
  DELETE_MY_MENTOR_SUCCESS,
  DELETE_MY_MENTOR,
  DELETE_MY_MENTOR_ERROR,
  DELETE_MY_FAILURE_ERROR,
  DELETE_MY_FAILURE_SUCCESS,
  DELETE_MY_FAILURE,
  SHOW_EDIT_MENTOR_MODAL,
  HIDE_EDIT_MENTOR_MODAL,
  DELETE_MY_MENTOR_IMAGE,
  DELETE_MY_MENTOR_IMAGE_SUCCESS,
  DELETE_MY_MENTOR_IMAGE_ERROR,
  DELETE_MY_FAILURE_IMAGE_SUCCESS,
  DELETE_MY_FAILURE_IMAGE_ERROR,
  DELETE_MY_FAILURE_IMAGE,
  SHOW_ADD_MENTOR_MODAL,
  HIDE_ADD_MENTOR_MODAL,
  SHOW_EDIT_FAILURE_MODAL,
  HIDE_EDIT_FAILURE_MODAL,
  SHOW_ADD_FAILURE_MODAL,
  HIDE_ADD_FAILURE_MODAL,
  GET_SHARING_SETTINGS_ERROR,
  GET_PUBLIC_PORTFOLIO,
  GET_PUBLIC_PORTFOLIO_SUCCESS,
  GET_PUBLIC_PORTFOLIO_ERROR,
  GET_MY_PROJECTS,
  GET_MY_PROJECTS_SUCCESS,
  GET_MY_PROJECTS_ERROR,
  GET_SKILLS,
  GET_SKILLS_SUCCESS,
  GET_SKILLS_ERROR,
  //// How do I prove it ////
  GET_MY_EDUCATIONS,
  GET_MY_EDUCATIONS_SUCCESS,
  GET_MY_EDUCATIONS_ERROR,
  UPDATE_MY_EDUCATION,
  UPDATE_MY_EDUCATION_SUCCESS,
  UPDATE_MY_EDUCATION_ERROR,
  ADD_MY_EDUCATION,
  ADD_MY_EDUCATION_SUCCESS,
  ADD_MY_EDUCATION_ERROR,
  DELETE_MY_EDUCATION,
  DELETE_MY_EDUCATION_SUCCESS,
  DELETE_MY_EDUCATION_ERROR,
  GET_MY_CREDENTIALS,
  GET_MY_CREDENTIALS_SUCCESS,
  GET_MY_CREDENTIALS_ERROR,
  UPDATE_MY_CREDENTIAL,
  UPDATE_MY_CREDENTIAL_SUCCESS,
  UPDATE_MY_CREDENTIAL_ERROR,
  ADD_MY_CREDENTIAL,
  ADD_MY_CREDENTIAL_SUCCESS,
  ADD_MY_CREDENTIAL_ERROR,
  DELETE_MY_CREDENTIAL,
  DELETE_MY_CREDENTIAL_SUCCESS,
  DELETE_MY_CREDENTIAL_ERROR,
  GET_MY_IMMERSIONS,
  GET_MY_IMMERSIONS_SUCCESS,
  GET_MY_IMMERSIONS_ERROR,
  UPDATE_MY_IMMERSION,
  UPDATE_MY_IMMERSION_SUCCESS,
  UPDATE_MY_IMMERSION_ERROR,
  ADD_MY_IMMERSION,
  ADD_MY_IMMERSION_SUCCESS,
  ADD_MY_IMMERSION_ERROR,
  DELETE_MY_IMMERSION,
  DELETE_MY_IMMERSION_SUCCESS,
  DELETE_MY_IMMERSION_ERROR,
  GET_MY_WORK_EXPERIENCES,
  GET_MY_WORK_EXPERIENCES_SUCCESS,
  GET_MY_WORK_EXPERIENCES_ERROR,
  UPDATE_MY_WORK_EXPERIENCE,
  UPDATE_MY_WORK_EXPERIENCE_SUCCESS,
  UPDATE_MY_WORK_EXPERIENCE_ERROR,
  ADD_MY_WORK_EXPERIENCE,
  ADD_MY_WORK_EXPERIENCE_SUCCESS,
  ADD_MY_WORK_EXPERIENCE_ERROR,
  DELETE_MY_WORK_EXPERIENCE,
  DELETE_MY_WORK_EXPERIENCE_SUCCESS,
  DELETE_MY_WORK_EXPERIENCE_ERROR,
  ADD_MY_COMPETITIVENESS_ERROR,
  DELETE_MY_COMPETITIVENESS,
  ADD_MY_COMPETITIVENESS_SUCCESS,
  ADD_MY_COMPETITIVENESS,
  UPDATE_MY_COMPETITIVENESS_ERROR,
  UPDATE_MY_COMPETITIVENESS_SUCCESS,
  UPDATE_MY_COMPETITIVENESS,
  GET_MY_COMPETITIVENESS_ERROR,
  GET_MY_COMPETITIVENESS_SUCCESS,
  GET_MY_COMPETITIVENESS,
  DELETE_MY_COMPETITIVENESS_SUCCESS,
  DELETE_MY_COMPETITIVENESS_ERROR,
  SHOW_EDIT_EDUCATION_MODAL,
  HIDE_EDIT_EDUCATION_MODAL,
  SHOW_ADD_EDUCATION_MODAL,
  HIDE_ADD_EDUCATION_MODAL,
  SHOW_EDIT_CREDENTIAL_MODAL,
  HIDE_EDIT_CREDENTIAL_MODAL,
  SHOW_ADD_CREDENTIAL_MODAL,
  HIDE_ADD_CREDENTIAL_MODAL,
  SHOW_EDIT_IMMERSION_MODAL,
  HIDE_EDIT_IMMERSION_MODAL,
  SHOW_ADD_IMMERSION_MODAL,
  HIDE_ADD_IMMERSION_MODAL,
  SHOW_EDIT_WORK_EXPERIENCE_MODAL,
  HIDE_EDIT_WORK_EXPERIENCE_MODAL,
  SHOW_ADD_WORK_EXPERIENCE_MODAL,
  HIDE_ADD_WORK_EXPERIENCE_MODAL,
  SHOW_EDIT_COMPETITIVENESS_MODAL,
  HIDE_EDIT_COMPETITIVENESS_MODAL,
  SHOW_ADD_COMPETITIVENESS_MODAL,
  HIDE_ADD_COMPETITIVENESS_MODAL,
  GET_BASIC_USER_INFO,
  GET_BASIC_USER_INFO_SUCCESS,
  SAVE_BASIC_USER_INFO,
  SAVE_BASIC_USER_INFO_SUCCESS,
  GET_USER_STORY,
  SHOW_EDIT_MY_STORY_MODAL,
  HIDE_EDIT_MY_STORY_MODAL,
  SHOW_ADD_MY_STORY_MODAL,
  HIDE_ADD_MY_STORY_MODAL,
  SHOW_EDIT_USER_BASIC_INFO_MODAL,
  HIDE_EDIT_USER_BASIC_INFO_MODAL,
  SHOW_ADD_USER_BASIC_INFO_MODAL,
  HIDE_ADD_USER_BASIC_INFO_MODAL,
  TOGGLE_USER_STORY,
  TOGGLE_USER_STORY_SUCCESS,
  TOGGLE_MY_RELATIONSHIPS,
  TOGGLE_MY_RELATIONSHIPS_SUCCESS,
  TOGGLE_MY_FAILURE,
  TOGGLE_MY_FAILURE_SUCCESS
} from './Constants'
import {
  createMyFailuresAPI,
  createMyMentorsAPI,
  createMyRelationshipsAPI,
  createSharingSettingsAPI,
  createUserStory,
  createUserBasicDataAPI,
  deleteMyFailuresAPI,
  deleteMyMentorsAPI,
  getMyFailuresAPI,
  getMyMentorsAPI,
  getMyProjectsAPI,
  getMyRelationshipsAPI,
  getPublicPortfolioAPI,
  getSharingSettingsAPI,
  getSkillsAPI,
  getUserBasicDataAPI,
  updateMyFailuresAPI,
  updateMyMentorsAPI,
  updateMyRelationshipsAPI,
  updateSharingSettingsAPI,
  updateUserBasicDataAPI,
  // How do I prove it //
  getMyEducationsAPI,
  updateMyEducationAPI,
  addMyEducationAPI,
  deleteMyEducationAPI,
  getMyCredentialsAPI,
  updateMyCredentialAPI,
  addMyCredentialAPI,
  deleteMyCredentialAPI,
  getMyImmersionsAPI,
  updateMyImmersionAPI,
  addMyImmersionAPI,
  deleteMyImmersionAPI,
  getWorkExperiencesAPI,
  updateWorkExperienceAPI,
  addWorkExperienceAPI,
  deleteWorkExperienceAPI,
  getMyCompetitivenessAPI,
  updateMyCompetitivenessAPI,
  createMyCompetitivenessAPI,
  deleteMyCompetitivenessAPI,
  getUserStoryAPI,
  updateUserStoryAPI,
  createUserStoryAPI
} from './Service'

export const getPublicPortfolio = () => async (dispatch) => {
  dispatch({ type: GET_PUBLIC_PORTFOLIO })
  try {
    const response = await getPublicPortfolioAPI()
    dispatch(getPublicPortfolioSuccess(response.data))
  } catch (e) {}
}
export const getPublicPortfolioSuccess = (data) => {
  return {
    type: GET_PUBLIC_PORTFOLIO_SUCCESS,
    payload: { data }
  }
}
export const changeViewMode = (mode) => async (dispatch) => {
  dispatch({ type: CHANGE_VIEW_MODE })
  try {
    dispatch(changeViewModeSuccess(mode))
  } catch (e) {}
}
export const changeViewModeSuccess = (mode) => {
  return {
    type: CHANGE_VIEW_MODE_SUCCESS,
    payload: { mode }
  }
}

export const changeActiveSection = (section) => async (dispatch) => {
  dispatch({ type: CHANGE_ACTIVE_SECTION })
  try {
    dispatch(changeActiveSectionSuccess(section))
  } catch (e) {}
}
export const changeActiveSectionSuccess = (section) => {
  return {
    type: CHANGE_ACTIVE_SECTION_SUCCESS,
    payload: { section }
  }
}

export const publishPortfolio = (publish) => async (dispatch) => {
  dispatch({ type: PUBLISH_PORTFOLIO_SECTION })
  try {
    dispatch(publishPortfolioSuccess(publish))
  } catch (e) {}
}
export const publishPortfolioSuccess = (publish) => {
  return {
    type: PUBLISH_PORTFOLIO_SECTION_SUCCESS,
    payload: { publish }
  }
}

export const sharePortfolio = (share) => async (dispatch) => {
  dispatch({ type: SHARE_PORTFOLIO_SECTION })
  try {
    dispatch(sharePortfolioSuccess(share))
  } catch (e) {}
}
export const sharePortfolioSuccess = (share) => {
  return {
    type: SHARE_PORTFOLIO_SECTION_SUCCESS,
    payload: { share }
  }
}

// Edit My Relationship Actions
export const editMyRelationship = (relationship) => async (dispatch) => {
  dispatch({ type: EDIT_MY_RELATIONSHIP })
  try {
    dispatch(editMyRelationshipSuccess(relationship))
  } catch (e) {
    dispatch(editMyRelationshipError(e))
  }
}

export const editMyRelationshipSuccess = (relationship) => {
  return {
    type: EDIT_MY_RELATIONSHIP_SUCCESS,
    payload: { relationship }
  }
}

export const editMyRelationshipError = (error) => {
  return {
    type: EDIT_MY_RELATIONSHIP_ERROR,
    payload: { error }
  }
}

// Edit My Failures Actions
export const editMyFailures = (failures) => async (dispatch) => {
  dispatch({ type: EDIT_MY_FAILURES })
  try {
    dispatch(editMyFailuresSuccess(failures))
  } catch (e) {
    dispatch(editMyFailuresError(e))
  }
}

export const editMyFailuresSuccess = (failures) => {
  return {
    type: EDIT_MY_FAILURES_SUCCESS,
    payload: { failures }
  }
}

export const editMyFailuresError = (error) => {
  return {
    type: EDIT_MY_FAILURES_ERROR,
    payload: { error }
  }
}

// Edit My Mentors Actions
export const editMyMentors = (mentors) => async (dispatch) => {
  dispatch({ type: EDIT_MY_MENTORS })
  try {
    dispatch(editMyMentorsSuccess(mentors))
  } catch (e) {
    dispatch(editMyMentorsError(e))
  }
}

export const editMyMentorsSuccess = (mentors) => {
  return {
    type: EDIT_MY_MENTORS_SUCCESS,
    payload: { mentors }
  }
}

export const editMyMentorsError = (error) => {
  return {
    type: EDIT_MY_MENTORS_ERROR,
    payload: { error }
  }
}

// Generic Edit Who Section Actions
export const editWhoSection = (type) => async (dispatch) => {
  dispatch({ type: EDIT_WHO_SECTION, payload: { type } })
  try {
    dispatch(editWhoSectionSuccess(type))
  } catch (e) {
    // Handle error (dispatch an error action if needed)
  }
}

export const editWhoSectionSuccess = (type) => {
  return {
    type: EDIT_WHO_SECTION_SUCCESS,
    payload: { type }
  }
}
// export const editWhoSectionError = (error) => {
//   return {
//     type: EDIT_MY_MENTORS_ERROR,
//     payload: { error }
//   }
// }
export const savePersonalBrandStory = (link) => (dispatch) => {
  dispatch({ type: SAVE_PERSONAL_BRAND_STORY })
  try {
    dispatch(savePersonalBrandStorySuccess(link))
  } catch (e) {}
}
export const savePersonalBrandStorySuccess = (link) => {
  return {
    type: SAVE_PERSONAL_BRAND_STORY_SUCCESS,
    payload: { youtubeLink: link }
  }
}

/// WHO AM I SECTION //

export const getUserBasicInfo = () => async (dispatch) => {
  dispatch({ type: GET_BASIC_USER_INFO })
  try {
    const response = await getUserBasicDataAPI()
    dispatch(getUserBasicDataSuccess(response?.data))
  } catch (e) {
    console.log('error', e)
  }
}
export const getUserBasicDataSuccess = (response) => {
  return {
    type: GET_BASIC_USER_INFO_SUCCESS,
    payload: { data: response }
  }
}
export const saveUserBasicData = (userStory, id) => async (dispatch) => {
  dispatch({ type: SAVE_BASIC_USER_INFO })
  try {
    let response
    if (id) {
      response = await updateUserBasicDataAPI(userStory, id)
    } else {
      response = await createUserBasicDataAPI(userStory)
    }
    dispatch(saveUserBasicDataSuccess(response?.data))
  } catch (e) {}
}
export const saveUserBasicDataSuccess = (response) => {
  return {
    type: SAVE_BASIC_USER_INFO_SUCCESS,
    payload: { data: response }
  }
}

export const getMyRelationships = () => async (dispatch) => {
  dispatch({ type: GET_MY_RELATIONSHIPS })
  try {
    const response = await getMyRelationshipsAPI()
    dispatch(getMyRelationshipsSuccess(response?.data))
  } catch (e) {
    console.log('error', e)
  }
}
export const getMyRelationshipsSuccess = (response) => {
  return {
    type: GET_MY_RELATIONSHIPS_SUCCESS,
    payload: { data: response }
  }
}
export const saveMyRelationships =
  (myRelationships, id) => async (dispatch) => {
    dispatch({ type: SAVE_MY_RELATIONSHIPS })
    try {
      let response
      if (id) {
        response = await updateMyRelationshipsAPI(myRelationships, id)
      } else {
        response = await createMyRelationshipsAPI(myRelationships)
      }
      dispatch(saveMyRelationshipsSuccess(response?.data))
    } catch (e) {}
  }
export const saveMyRelationshipsSuccess = (response) => {
  return {
    type: SAVE_MY_RELATIONSHIPS_SUCCESS,
    payload: { data: response }
  }
}

export const toggleMyRelationships =
  (myRelationships, id) => async (dispatch) => {
    dispatch({ type: TOGGLE_MY_RELATIONSHIPS })
    try {
      let response

      if (id) {
        response = await updateMyRelationshipsAPI(myRelationships, id)
      } else {
        response = await createMyRelationshipsAPI(myRelationships)
      }
      dispatch(toggleMyRelationshipsSuccess(response?.data))
    } catch (e) {}
  }
export const toggleMyRelationshipsSuccess = (response) => {
  return {
    type: TOGGLE_MY_RELATIONSHIPS_SUCCESS,
    payload: { data: response }
  }
}

export const getUserStory = () => async (dispatch) => {
  dispatch({ type: GET_USER_STORY })
  try {
    const response = await getUserStoryAPI()

    dispatch(getUserStorySuccess(response?.data))
  } catch (e) {
    console.log('error', e)
  }
}
export const getUserStorySuccess = (response) => {
  return {
    type: GET_USER_STORY_SUCCESS,
    payload: { data: response }
  }
}
export const saveUserStory = (userStory, id) => async (dispatch) => {
  dispatch({ type: SAVE_USER_STORY })
  try {
    let response
    if (id) {
      response = await updateUserStoryAPI(userStory, id)
    } else {
      response = await createUserStoryAPI(userStory)
    }

    const isEdit = id
    dispatch(saveUserStorySuccess(response.data, isEdit))
  } catch (e) {}
}
export const saveUserStorySuccess = (response, isEdit) => {
  return {
    type: SAVE_USER_STORY_SUCCESS,
    payload: { data: response },
    isEdit
  }
}

export const toggleUserStory = (userStory, id) => async (dispatch) => {
  dispatch({ type: TOGGLE_USER_STORY })
  try {
    let response
    if (id) {
      response = await updateUserStoryAPI(userStory, id)
    } else {
      response = await createUserStoryAPI(userStory)
    }

    const isEdit = id
    dispatch(toggleUserStorySuccess(response.data, isEdit))
  } catch (e) {}
}
export const toggleUserStorySuccess = (response, isEdit) => {
  return {
    type: TOGGLE_USER_STORY_SUCCESS,
    payload: { data: response },
    isEdit
  }
}

// MY FAILURES
export const getMyFailures = () => async (dispatch) => {
  dispatch({ type: GET_MY_FAILURES })
  try {
    const response = await getMyFailuresAPI()
    dispatch(getMyFailuresSuccess(response?.data))
  } catch (e) {
    console.log('error', e)
  }
}
export const getMyFailuresSuccess = (response) => {
  return {
    type: GET_MY_FAILURES_SUCCESS,
    payload: { data: response }
  }
}
export const createMyFailure = (myFailure) => async (dispatch) => {
  dispatch({ type: CREATE_MY_FAILURE })
  try {
    const response = await createMyFailuresAPI(myFailure)
    dispatch(createMyFailureSuccess(response.data))
  } catch (e) {
    dispatch(createMyFailureError(e))
  }
}

export const createMyFailureSuccess = (response) => {
  return {
    type: CREATE_MY_FAILURE_SUCCESS,
    payload: { data: response }
  }
}

export const createMyFailureError = (error) => {
  return {
    type: CREATE_MY_FAILURE_ERROR,
    payload: { error }
  }
}

export const updateMyFailure = (myFailure, id) => async (dispatch) => {
  dispatch({ type: UPDATE_MY_FAILURE })
  try {
    const response = await updateMyFailuresAPI(myFailure, id)
    dispatch(updateMyFailureSuccess(response.data, id))
  } catch (e) {
    dispatch(updateMyFailureError(e))
  }
}

export const updateMyFailureSuccess = (response, id) => {
  return {
    type: UPDATE_MY_FAILURE_SUCCESS,
    payload: { data: response, id }
  }
}

export const updateMyFailureError = (error) => {
  return {
    type: UPDATE_MY_FAILURE_ERROR,
    payload: { error }
  }
}

export const deleteMyFailure = (id) => async (dispatch) => {
  dispatch({ type: DELETE_MY_FAILURE })
  try {
    const response = await deleteMyFailuresAPI(id)
    if (response.status === 200) {
      dispatch(deleteMyFailureSuccess(id))
    } else {
      console.log('Failed to delete mentor')
    }
  } catch (e) {
    dispatch(deleteMyFailureError(e))
  }
}

export const deleteMyFailureSuccess = (id) => {
  return {
    type: DELETE_MY_FAILURE_SUCCESS,
    payload: { id }
  }
}

export const deleteMyFailureError = (error) => {
  return {
    type: DELETE_MY_FAILURE_ERROR,
    payload: { error }
  }
}

export const deleteMyFailureImage = (myFailure, id) => async (dispatch) => {
  dispatch({ type: DELETE_MY_FAILURE_IMAGE })
  try {
    const response = await updateMyFailuresAPI(myFailure, id)
    dispatch(deleteMyFailureImageSuccess(response.data, id))
  } catch (e) {
    dispatch(deleteMyFailureImageError(e))
  }
}

export const deleteMyFailureImageSuccess = (response, id) => {
  return {
    type: DELETE_MY_FAILURE_IMAGE_SUCCESS,
    payload: { id, data: response }
  }
}

export const deleteMyFailureImageError = (error) => {
  return {
    type: DELETE_MY_FAILURE_IMAGE_ERROR,
    payload: { error }
  }
}

export const toggleMyFailure = (myFailure, id) => async (dispatch) => {
  dispatch({ type: TOGGLE_MY_FAILURE })
  try {
    let response

    if (id) {
      response = await updateMyFailuresAPI(myFailure, id)
    } else {
      response = await createMyFailuresAPI(myFailure)
    }
    dispatch(toggleMyFailureSuccess(response?.data))
  } catch (e) {}
}
export const toggleMyFailureSuccess = (response) => {
  return {
    type: TOGGLE_MY_FAILURE_SUCCESS,
    payload: { data: response }
  }
}

// MY MENTORS
export const getMyMentors = () => async (dispatch) => {
  dispatch({ type: GET_MY_MENTORS })
  try {
    const response = await getMyMentorsAPI()

    dispatch(getMyMentorsSuccess(response.data))
  } catch (e) {
    console.log('error', e)
  }
}

export const getMyMentorsSuccess = (response) => {
  return {
    type: GET_MY_MENTORS_SUCCESS,
    payload: { data: response }
  }
}

export const createMyMentor = (myMentor) => async (dispatch) => {
  dispatch({ type: CREATE_MY_MENTOR })
  try {
    const response = await createMyMentorsAPI(myMentor)
    dispatch(createMyMentorSuccess(response.data))
  } catch (e) {
    dispatch(createMyMentorError(e))
  }
}

export const createMyMentorSuccess = (response) => {
  return {
    type: CREATE_MY_MENTOR_SUCCESS,
    payload: { data: response }
  }
}

export const createMyMentorError = (error) => {
  return {
    type: CREATE_MY_MENTOR_ERROR,
    payload: { error }
  }
}

export const updateMyMentor = (myMentor, id) => async (dispatch) => {
  dispatch({ type: UPDATE_MY_MENTOR })
  try {
    const response = await updateMyMentorsAPI(myMentor, id)
    dispatch(updateMyMentorSuccess(response.data, id))
  } catch (e) {
    dispatch(updateMyMentorError(e))
  }
}

export const updateMyMentorSuccess = (response, id) => {
  return {
    type: UPDATE_MY_MENTOR_SUCCESS,
    payload: { data: response, id }
  }
}

export const updateMyMentorError = (error) => {
  return {
    type: UPDATE_MY_MENTOR_ERROR,
    payload: { error }
  }
}

export const deleteMentorImage = (mentorImage, id) => async (dispatch) => {
  dispatch({ type: DELETE_MY_MENTOR_IMAGE })
  try {
    const response = await updateMyMentorsAPI(mentorImage, id)
    dispatch(deleteMentorImageSuccess(response.data, id))
  } catch (e) {
    dispatch(deleteMentorImageError(e))
  }
}

export const deleteMentorImageSuccess = (response, id) => {
  return {
    type: DELETE_MY_MENTOR_IMAGE_SUCCESS,
    payload: { data: response, id }
  }
}

export const deleteMentorImageError = (error) => {
  return {
    type: DELETE_MY_MENTOR_IMAGE_ERROR,
    payload: { error }
  }
}

export const deleteMyMentor = (id) => async (dispatch) => {
  dispatch({ type: DELETE_MY_MENTOR })
  try {
    const response = await deleteMyMentorsAPI(id)
    if (response.status === 200) {
      dispatch(deleteMyMentorSuccess(id))
    } else {
      console.log('Failed to delete mentor')
    }
  } catch (e) {
    dispatch(deleteMyMentorError(e))
  }
}

export const deleteMyMentorSuccess = (id) => {
  return {
    type: DELETE_MY_MENTOR_SUCCESS,
    payload: { id }
  }
}

export const deleteMyMentorError = (error) => {
  return {
    type: DELETE_MY_MENTOR_ERROR,
    payload: { error }
  }
}

// PORTFOLIO SHARING SETTINGS
export const updateSharingSettings =
  (portfolioPrivacy, type, isEdit) => async (dispatch) => {
    dispatch({ type: UPDATE_SHARING_SETTINGS })
    try {
      let response
      if (portfolioPrivacy?.id) {
        response = await updateSharingSettingsAPI(portfolioPrivacy)
      } else {
        response = await createSharingSettingsAPI(portfolioPrivacy)
      }
      dispatch(updateSharingSettingsSuccess(response.data, type))
    } catch (e) {}
  }

export const updateSharingSettingsSuccess = (response, type) => {
  return {
    type: UPDATE_SHARING_SETTINGS_SUCCESS,
    payload: { data: response, type }
  }
}

export const getSharingSettings = (portfolioPrivacy) => async (dispatch) => {
  dispatch({ type: GET_SHARING_SETTINGS })
  try {
    const response = await getSharingSettingsAPI(portfolioPrivacy)
    dispatch(getSharingSettingsSuccess(response.data))
  } catch (e) {
    dispatch(getSharingSettingsError(e))
  }
}

export const getSharingSettingsSuccess = (response) => {
  return {
    type: GET_SHARING_SETTINGS_SUCCESS,
    payload: { data: response }
  }
}

export const getSharingSettingsError = (error) => {
  return {
    type: GET_SHARING_SETTINGS_ERROR,
    payload: { error }
  }
}

export const setConfirmVisibilityModal = (visibility) => (dispatch) => {
  dispatch({ type: SET_VISIBILITY_MODAL })
  try {
    // const response = await getPortfolioPrivacyAPI(portfolioPrivacy)
    dispatch(setConfirmVisibilityModalSuccess(visibility))
  } catch (e) {}
}

export const setConfirmVisibilityModalSuccess = (visibility) => {
  return {
    type: SET_VISIBILITY_MODAL_SUCCESS,
    payload: { visibility }
  }
}
export const setConfirmVisibilityModalContent = (content) => (dispatch) => {
  dispatch({ type: SET_VISIBILITY_MODAL_CONTENT })
  try {
    // const response = await getPortfolioPrivacyAPI(portfolioPrivacy)
    dispatch(setConfirmVisibilityModalContentSuccess(content))
  } catch (e) {}
}

export const setConfirmVisibilityModalContentSuccess = (content) => {
  return {
    type: SET_VISIBILITY_MODAL_CONTENT_SUCCESS,
    payload: { content }
  }
}

// MODALS
export const setShareModal = (visibility) => (dispatch) => {
  dispatch({ type: SET_SHARE_MODAL })
  try {
    // const response = await getPortfolioPrivacyAPI(portfolioPrivacy)
    dispatch(setShareModalSuccess(visibility))
  } catch (e) {}
}

export const setShareModalSuccess = (visibility) => {
  return {
    type: SET_SHARE_MODAL_SUCCESS,
    payload: { visibility }
  }
}
export const setShareModalContent = (content) => (dispatch) => {
  dispatch({ type: SET_SHARE_MODAL_CONTENT })
  try {
    // const response = await getPortfolioPrivacyAPI(portfolioPrivacy)
    dispatch(setShareModalContentSuccess(content))
  } catch (e) {}
}

export const setShareModalContentSuccess = (content) => {
  return {
    type: SET_SHARE_MODAL_CONTENT_SUCCESS,
    payload: { content }
  }
}
export const setPublishModal = (visibility) => (dispatch) => {
  dispatch({ type: SET_PUBLISH_MODAL })
  try {
    // const response = await getPortfolioPrivacyAPI(portfolioPrivacy)
    dispatch(setPublishModalSuccess(visibility))
  } catch (e) {}
}

export const setPublishModalSuccess = (visibility) => {
  return {
    type: SET_PUBLISH_MODAL_SUCCESS,
    payload: { visibility }
  }
}

export const showEditMyStoryModal = () => ({
  type: SHOW_EDIT_MY_STORY_MODAL
})

export const hideEditMyStoryModal = () => ({
  type: HIDE_EDIT_MY_STORY_MODAL
})

export const showAddMyStoryModal = () => ({
  type: SHOW_ADD_MY_STORY_MODAL
})

export const hideAddMyStoryModal = () => ({
  type: HIDE_ADD_MY_STORY_MODAL
})

export const showEditUserBasicInfoModal = () => ({
  type: SHOW_EDIT_USER_BASIC_INFO_MODAL
})

export const hideEditUserBasicInfoModal = () => ({
  type: HIDE_EDIT_USER_BASIC_INFO_MODAL
})

export const showAddUserBasicInfoModal = () => ({
  type: SHOW_ADD_USER_BASIC_INFO_MODAL
})

export const hideAddUserBasicInfoModal = () => ({
  type: HIDE_ADD_USER_BASIC_INFO_MODAL
})
export const showEditMentorModal = (id) => ({
  type: SHOW_EDIT_MENTOR_MODAL,
  payload: id
})

export const hideEditMentorModal = () => ({
  type: HIDE_EDIT_MENTOR_MODAL
})

export const showAddMentorModal = () => ({
  type: SHOW_ADD_MENTOR_MODAL
})

export const hideAddMentorModal = () => ({
  type: HIDE_ADD_MENTOR_MODAL
})

export const showEditFailureModal = (id) => ({
  type: SHOW_EDIT_FAILURE_MODAL,
  payload: id
})

export const hideEditFailureModal = () => ({
  type: HIDE_EDIT_FAILURE_MODAL
})

export const showAddFailureModal = () => ({
  type: SHOW_ADD_FAILURE_MODAL
})

export const hideAddFailureModal = () => ({
  type: HIDE_ADD_FAILURE_MODAL
})

export const showEditEducationModal = (id) => ({
  type: SHOW_EDIT_EDUCATION_MODAL,
  payload: id
})

export const hideEditEducationModal = () => ({
  type: HIDE_EDIT_EDUCATION_MODAL
})

export const showAddEducationModal = () => ({
  type: SHOW_ADD_EDUCATION_MODAL
})

export const hideAddEducationModal = () => ({
  type: HIDE_ADD_EDUCATION_MODAL
})

export const showEditCredentialModal = (id) => {
  return {
    type: SHOW_EDIT_CREDENTIAL_MODAL,
    payload: id
  }
}

export const hideEditCredentialModal = () => ({
  type: HIDE_EDIT_CREDENTIAL_MODAL
})

export const showAddCredentialModal = () => ({
  type: SHOW_ADD_CREDENTIAL_MODAL
})

export const hideAddCredentialModal = () => ({
  type: HIDE_ADD_CREDENTIAL_MODAL
})

//
export const showEditImmersionModal = (id) => {
  return {
    type: SHOW_EDIT_IMMERSION_MODAL,
    payload: id
  }
}

export const hideEditImmersionModal = () => ({
  type: HIDE_EDIT_IMMERSION_MODAL
})

export const showAddImmersionModal = () => ({
  type: SHOW_ADD_IMMERSION_MODAL
})

export const hideAddImmersionModal = () => ({
  type: HIDE_ADD_IMMERSION_MODAL
})

export const showEditWorkExperienceModal = (id) => {
  return {
    type: SHOW_EDIT_WORK_EXPERIENCE_MODAL,
    payload: id
  }
}

export const hideEditWorkExperienceModal = () => ({
  type: HIDE_EDIT_WORK_EXPERIENCE_MODAL
})

export const showAddWorkExperienceModal = () => ({
  type: SHOW_ADD_WORK_EXPERIENCE_MODAL
})

export const hideAddWorkExperienceModal = () => ({
  type: HIDE_ADD_WORK_EXPERIENCE_MODAL
})

export const showEditCompetitivenessModal = (id) => ({
  type: SHOW_EDIT_COMPETITIVENESS_MODAL,
  payload: id
})

export const hideEditCompetitivenessModal = () => ({
  type: HIDE_EDIT_COMPETITIVENESS_MODAL
})

export const showAddCompetitivenessModal = () => ({
  type: SHOW_ADD_COMPETITIVENESS_MODAL
})

export const hideAddCompetitivenessModal = () => ({
  type: HIDE_ADD_COMPETITIVENESS_MODAL
})
/// WHAT CAN I DO SECTION ///
export const getSkills = () => async (dispatch) => {
  dispatch({ type: GET_SKILLS })
  try {
    const response = await getSkillsAPI()
    let newResponse = { ...response }
    newResponse.data = response.data.skills.reduce((acc, skill) => {
      const category = skill.category

      if (!acc[category]) {
        acc[category] = []
      }

      acc[category].push(skill)

      return acc
    }, {})
    dispatch(getSkillsSuccess(newResponse.data))
  } catch (e) {
    dispatch(getSkillsError(e))
  }
}

export const getSkillsSuccess = (response) => {
  return {
    type: GET_SKILLS_SUCCESS,
    payload: { data: response }
  }
}

export const getSkillsError = (error) => {
  return {
    type: GET_SKILLS_ERROR,
    payload: { error }
  }
}

export const getProjects = () => async (dispatch) => {
  dispatch({ type: GET_MY_PROJECTS })
  try {
    const response = await getMyProjectsAPI()
    if (response.data.length) {
      dispatch(getProjectsSuccess(response.data))
    } else {
      const evidences = [
        {
          type: 'evidence-1',
          imageUrl: null,
          linkInputValue: '',
          selectedSkills: [],
          imageFile: null
        },
        {
          type: 'evidence-2',
          imageUrl: null,
          linkInputValue: '',
          selectedSkills: [],
          imageFile: null
        },
        {
          type: 'evidence-3',
          imageUrl: null,
          linkInputValue: '',
          selectedSkills: [],
          imageFile: null
        }
      ]
      const initialData = [
        {
          children: [
            {
              type: 'learn',
              showSection: true,
              evidences
            },
            {
              type: 'develop',
              showSection: true,
              editorContent: '',
              evidences
            },
            {
              type: 'brand',
              showSection: true,
              editorContent: '',
              evidences
            }
          ]
        }
      ]
      dispatch(getProjectsSuccess(initialData))
    }
  } catch (e) {
    dispatch(getProjectsError(e))
  }
}

export const getProjectsSuccess = (response) => {
  return {
    type: GET_MY_PROJECTS_SUCCESS,
    payload: { data: response }
  }
}

export const getProjectsError = (error) => {
  return {
    type: GET_MY_PROJECTS_ERROR,
    payload: { error }
  }
}
///////////////////////////////////
///// HOW DO I PROVE IT ///////////
///////////////////////////////////

// Get Educations
export const getMyEducations = () => async (dispatch) => {
  dispatch({ type: GET_MY_EDUCATIONS })
  try {
    const response = await getMyEducationsAPI()
    dispatch(getMyEducationsSuccess(response.data))
  } catch (e) {
    dispatch(getMyEducationsError(e))
  }
}

export const getMyEducationsSuccess = (response) => {
  return {
    type: GET_MY_EDUCATIONS_SUCCESS,
    payload: { data: response }
  }
}

export const getMyEducationsError = (error) => {
  return {
    type: GET_MY_EDUCATIONS_ERROR,
    payload: { error }
  }
}

// Update Education
export const updateMyEducation = (education) => async (dispatch) => {
  dispatch({ type: UPDATE_MY_EDUCATION })
  try {
    const response = await updateMyEducationAPI(education)
    dispatch(updateMyEducationSuccess(response.data))
  } catch (e) {
    dispatch(updateMyEducationError(e))
  }
}

export const updateMyEducationSuccess = (response) => {
  return {
    type: UPDATE_MY_EDUCATION_SUCCESS,
    payload: { data: response }
  }
}

export const updateMyEducationError = (error) => {
  return {
    type: UPDATE_MY_EDUCATION_ERROR,
    payload: { error }
  }
}

// Add Education
export const addMyEducation = (education) => async (dispatch) => {
  dispatch({ type: ADD_MY_EDUCATION })
  try {
    const response = await addMyEducationAPI(education)
    dispatch(addMyEducationSuccess(response.data))
  } catch (e) {
    dispatch(addMyEducationError(e))
  }
}

export const addMyEducationSuccess = (response) => {
  return {
    type: ADD_MY_EDUCATION_SUCCESS,
    payload: { data: response }
  }
}

export const addMyEducationError = (error) => {
  return {
    type: ADD_MY_EDUCATION_ERROR,
    payload: { error }
  }
}

// Delete Education
export const deleteMyEducation = (educationId) => async (dispatch) => {
  dispatch({ type: DELETE_MY_EDUCATION })
  try {
    const response = await deleteMyEducationAPI(educationId)
    dispatch(deleteMyEducationSuccess(response.data))
  } catch (e) {
    dispatch(deleteMyEducationError(e))
  }
}

export const deleteMyEducationSuccess = (response) => {
  return {
    type: DELETE_MY_EDUCATION_SUCCESS,
    payload: { data: response }
  }
}

export const deleteMyEducationError = (error) => {
  return {
    type: DELETE_MY_EDUCATION_ERROR,
    payload: { error }
  }
}

// Get Credentials
export const getMyCredentials = () => async (dispatch) => {
  dispatch({ type: GET_MY_CREDENTIALS })
  try {
    const response = await getMyCredentialsAPI()
    dispatch(getMyCredentialsSuccess(response.data))
  } catch (e) {
    dispatch(getMyCredentialsError(e))
  }
}

export const getMyCredentialsSuccess = (response) => {
  return {
    type: GET_MY_CREDENTIALS_SUCCESS,
    payload: { data: response }
  }
}

export const getMyCredentialsError = (error) => {
  return {
    type: GET_MY_CREDENTIALS_ERROR,
    payload: { error }
  }
}

// Update Credential
export const updateMyCredential = (credential) => async (dispatch) => {
  dispatch({ type: UPDATE_MY_CREDENTIAL })
  try {
    const response = await updateMyCredentialAPI(credential)

    dispatch(updateMyCredentialSuccess(response.data))
  } catch (e) {
    dispatch(updateMyCredentialError(e))
  }
}

export const updateMyCredentialSuccess = (response) => {
  return {
    type: UPDATE_MY_CREDENTIAL_SUCCESS,
    payload: { data: response }
  }
}

export const updateMyCredentialError = (error) => {
  return {
    type: UPDATE_MY_CREDENTIAL_ERROR,
    payload: { error }
  }
}

// Add Credential
export const addMyCredential = (credential) => async (dispatch) => {
  dispatch({ type: ADD_MY_CREDENTIAL })
  try {
    const response = await addMyCredentialAPI(credential)
    dispatch(addMyCredentialSuccess(response.data))
  } catch (e) {
    dispatch(addMyCredentialError(e))
  }
}

export const addMyCredentialSuccess = (response) => {
  return {
    type: ADD_MY_CREDENTIAL_SUCCESS,
    payload: { data: response }
  }
}

export const addMyCredentialError = (error) => {
  return {
    type: ADD_MY_CREDENTIAL_ERROR,
    payload: { error }
  }
}

// Delete Credential
export const deleteMyCredential = (credentialId) => async (dispatch) => {
  dispatch({ type: DELETE_MY_CREDENTIAL })
  try {
    const response = await deleteMyCredentialAPI(credentialId)
    dispatch(deleteMyCredentialSuccess(response.data))
  } catch (e) {
    dispatch(deleteMyCredentialError(e))
  }
}

export const deleteMyCredentialSuccess = (response) => {
  return {
    type: DELETE_MY_CREDENTIAL_SUCCESS,
    payload: { data: response }
  }
}

export const deleteMyCredentialError = (error) => {
  return {
    type: DELETE_MY_CREDENTIAL_ERROR,
    payload: { error }
  }
}

// Get Immersions
export const getMyImmersions = () => async (dispatch) => {
  dispatch({ type: GET_MY_IMMERSIONS })
  try {
    const response = await getMyImmersionsAPI()
    dispatch(getMyImmersionsSuccess(response.data))
  } catch (e) {
    dispatch(getMyImmersionsError(e))
  }
}

export const getMyImmersionsSuccess = (response) => {
  return {
    type: GET_MY_IMMERSIONS_SUCCESS,
    payload: { data: response }
  }
}

export const getMyImmersionsError = (error) => {
  return {
    type: GET_MY_IMMERSIONS_ERROR,
    payload: { error }
  }
}

// Update Immersion
export const updateMyImmersion = (immersion) => async (dispatch) => {
  dispatch({ type: UPDATE_MY_IMMERSION })
  try {
    const response = await updateMyImmersionAPI(immersion)
    dispatch(updateMyImmersionSuccess(response.data))
  } catch (e) {
    dispatch(updateMyImmersionError(e))
  }
}

export const updateMyImmersionSuccess = (response) => {
  return {
    type: UPDATE_MY_IMMERSION_SUCCESS,
    payload: { data: response }
  }
}

export const updateMyImmersionError = (error) => {
  return {
    type: UPDATE_MY_IMMERSION_ERROR,
    payload: { error }
  }
}

// Add Immersion
export const addMyImmersion = (immersion) => async (dispatch) => {
  dispatch({ type: ADD_MY_IMMERSION })
  try {
    const response = await addMyImmersionAPI(immersion)
    dispatch(addMyImmersionSuccess(response.data))
  } catch (e) {
    dispatch(addMyImmersionError(e))
  }
}

export const addMyImmersionSuccess = (response) => {
  return {
    type: ADD_MY_IMMERSION_SUCCESS,
    payload: { data: response }
  }
}

export const addMyImmersionError = (error) => {
  return {
    type: ADD_MY_IMMERSION_ERROR,
    payload: { error }
  }
}

export const deleteMyImmersion = (immersionId) => async (dispatch) => {
  dispatch({ type: DELETE_MY_IMMERSION })
  try {
    const response = await deleteMyImmersionAPI(immersionId)
    dispatch(deleteMyImmersionSuccess(response.data))
  } catch (e) {
    dispatch(deleteMyImmersionError(e))
  }
}

export const deleteMyImmersionSuccess = (response) => {
  return {
    type: DELETE_MY_IMMERSION_SUCCESS,
    payload: { data: response }
  }
}

export const deleteMyImmersionError = (error) => {
  return {
    type: DELETE_MY_IMMERSION_ERROR,
    payload: { error }
  }
}

export const getMyWorkExperiences = () => async (dispatch) => {
  dispatch({ type: GET_MY_WORK_EXPERIENCES })
  try {
    const response = await getWorkExperiencesAPI()
    dispatch(getMyWorkExperiencesSuccess(response.data))
  } catch (e) {
    dispatch(getMyWorkExperiencesError(e))
  }
}

export const getMyWorkExperiencesSuccess = (response) => {
  return {
    type: GET_MY_WORK_EXPERIENCES_SUCCESS,
    payload: { data: response }
  }
}

export const getMyWorkExperiencesError = (error) => {
  return {
    type: GET_MY_WORK_EXPERIENCES_ERROR,
    payload: { error }
  }
}

// Update Work Experience
export const updateMyWorkExperience = (workExperience) => async (dispatch) => {
  dispatch({ type: UPDATE_MY_WORK_EXPERIENCE })
  try {
    const response = await updateWorkExperienceAPI(workExperience)
    dispatch(updateMyWorkExperienceSuccess(response.data))
  } catch (e) {
    dispatch(updateMyWorkExperienceError(e))
  }
}

export const updateMyWorkExperienceSuccess = (response) => {
  return {
    type: UPDATE_MY_WORK_EXPERIENCE_SUCCESS,
    payload: { data: response }
  }
}

export const updateMyWorkExperienceError = (error) => {
  return {
    type: UPDATE_MY_WORK_EXPERIENCE_ERROR,
    payload: { error }
  }
}

// Add Work Experience
export const addMyWorkExperience = (workExperience) => async (dispatch) => {
  dispatch({ type: ADD_MY_WORK_EXPERIENCE })
  try {
    const response = await addWorkExperienceAPI(workExperience)
    dispatch(addMyWorkExperienceSuccess(response.data))
  } catch (e) {
    dispatch(addMyWorkExperienceError(e))
  }
}

export const addMyWorkExperienceSuccess = (response) => {
  return {
    type: ADD_MY_WORK_EXPERIENCE_SUCCESS,
    payload: { data: response }
  }
}

export const addMyWorkExperienceError = (error) => {
  return {
    type: ADD_MY_WORK_EXPERIENCE_ERROR,
    payload: { error }
  }
}

// Delete Work Experience
export const deleteMyWorkExperience =
  (workExperienceId) => async (dispatch) => {
    dispatch({ type: DELETE_MY_WORK_EXPERIENCE })
    try {
      const response = await deleteWorkExperienceAPI(workExperienceId)
      dispatch(deleteMyWorkExperienceSuccess(response.data))
    } catch (e) {
      dispatch(deleteMyWorkExperienceError(e))
    }
  }

export const deleteMyWorkExperienceSuccess = (response) => {
  return {
    type: DELETE_MY_WORK_EXPERIENCE_SUCCESS,
    payload: { data: response }
  }
}

export const deleteMyWorkExperienceError = (error) => {
  return {
    type: DELETE_MY_WORK_EXPERIENCE_ERROR,
    payload: { error }
  }
}

// Get Competitiveness
export const getMyCompetitiveness = () => async (dispatch) => {
  dispatch({ type: GET_MY_COMPETITIVENESS })
  try {
    const response = await getMyCompetitivenessAPI()

    dispatch(getMyCompetitivenessSuccess(response.data))
  } catch (e) {
    dispatch(getMyCompetitivenessError(e))
  }
}

export const getMyCompetitivenessSuccess = (response) => {
  return {
    type: GET_MY_COMPETITIVENESS_SUCCESS,
    payload: { data: response }
  }
}

export const getMyCompetitivenessError = (error) => {
  return {
    type: GET_MY_COMPETITIVENESS_ERROR,
    payload: { error }
  }
}

// Update Competitiveness
export const updateMyCompetitiveness =
  (competitiveness, id, category) => async (dispatch) => {
    dispatch({ type: UPDATE_MY_COMPETITIVENESS })
    try {
      const response = await updateMyCompetitivenessAPI(competitiveness, id)
      dispatch(updateMyCompetitivenessSuccess(response.data, category))
    } catch (e) {
      dispatch(updateMyCompetitivenessError(e, category))
    }
  }

export const updateMyCompetitivenessSuccess = (response, category) => {
  return {
    type: UPDATE_MY_COMPETITIVENESS_SUCCESS,
    payload: { data: response, category }
  }
}

export const updateMyCompetitivenessError = (error, category) => {
  return {
    type: UPDATE_MY_COMPETITIVENESS_ERROR,
    payload: { error, category }
  }
}

// Add Competitiveness
export const addMyCompetitiveness = (competitiveness) => async (dispatch) => {
  dispatch({ type: ADD_MY_COMPETITIVENESS })
  try {
    const response = await createMyCompetitivenessAPI(competitiveness)
    dispatch(addMyCompetitivenessSuccess(response.data))
  } catch (e) {
    dispatch(addMyCompetitivenessError(e))
  }
}

export const addMyCompetitivenessSuccess = (response) => {
  return {
    type: ADD_MY_COMPETITIVENESS_SUCCESS,
    payload: { data: response }
  }
}

export const addMyCompetitivenessError = (error) => {
  return {
    type: ADD_MY_COMPETITIVENESS_ERROR,
    payload: { error }
  }
}

// Delete Competitiveness
export const deleteMyCompetitiveness =
  (competitivenessId) => async (dispatch) => {
    dispatch({ type: DELETE_MY_COMPETITIVENESS })
    try {
      const response = await deleteMyCompetitivenessAPI(competitivenessId)
      dispatch(deleteMyCompetitivenessSuccess(response.data))
    } catch (e) {
      dispatch(deleteMyCompetitivenessError(e))
    }
  }

export const deleteMyCompetitivenessSuccess = (response) => {
  return {
    type: DELETE_MY_COMPETITIVENESS_SUCCESS,
    payload: { data: response, id: response.id }
  }
}

export const deleteMyCompetitivenessError = (error) => {
  return {
    type: DELETE_MY_COMPETITIVENESS_ERROR,
    payload: { error }
  }
}
export const deleteMyCompetitivenessImage =
  (mentorImage, id) => async (dispatch) => {
    dispatch({ type: DELETE_MY_MENTOR_IMAGE })
    try {
      const response = await updateMyCompetitivenessAPI(mentorImage, id)
      dispatch(deleteMyCompetitivenessImageSuccess(response.data, id))
    } catch (e) {
      dispatch(deleteMyCompetitivenessImageError(e))
    }
  }

export const deleteMyCompetitivenessImageSuccess = (response, id) => {
  return {
    type: DELETE_MY_MENTOR_IMAGE_SUCCESS,
    payload: { data: response, id }
  }
}

export const deleteMyCompetitivenessImageError = (error) => {
  return {
    type: DELETE_MY_MENTOR_IMAGE_ERROR,
    payload: { error }
  }
}
