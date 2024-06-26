import axiosInstance from '../../utils/AxiosInstance'
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
  GET_USER_STORY,
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
  UPDATE_PORTFOLIO_PRIVACY,
  UPDATE_PORTFOLIO_PRIVACY_SUCCESS,
  GET_PORTFOLIO_PRIVACY,
  GET_PORTFOLIO_PRIVACY_SUCCESS,
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
  HIDE_ADD_FAILURE_MODAL
} from './Constants'
import {
  createMyFailuresAPI,
  createMyMentorsAPI,
  createMyRelationshipsAPI,
  createUserStory,
  createUserStoryAPI,
  deleteMyFailuresAPI,
  deleteMyMentorsAPI,
  getMyFailuresAPI,
  getMyMentorsAPI,
  getMyRelationshipsAPI,
  getPortfolioPrivacyAPI,
  getUserStoryAPI,
  updateMyFailuresAPI,
  updateMyMentorsAPI,
  updateMyRelationshipsAPI,
  updatePortfolioPrivacyAPI,
  updateUserStoryAPI
} from './Service'

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

// Edit User Story Actions
// export const editUserStory = (userStory) => async (dispatch) => {
//   dispatch({ type: EDIT_USER_STORY })
//   try {
//     dispatch(editUserStorySuccess(userStory))
//   } catch (e) {
//     dispatch(editUserStoryError(e))
//   }
// }
//
// export const editUserStorySuccess = (userStory) => {
//   return {
//     type: EDIT_USER_STORY_SUCCESS,
//     payload: { userStory }
//   }
// }
//
// export const editUserStoryError = (error) => {
//   return {
//     type: EDIT_USER_STORY_ERROR,
//     payload: { error }
//   }
// }

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

export const getUserStory = () => async (dispatch) => {
  dispatch({ type: GET_USER_STORY })
  try {
    const response = await getUserStoryAPI()
    dispatch(getUserStorySuccess(response.data))
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
    dispatch(saveUserStorySuccess(response.data))
  } catch (e) {}
}
export const saveUserStorySuccess = (response) => {
  return {
    type: SAVE_USER_STORY_SUCCESS,
    payload: { data: response }
  }
}

export const getMyRelationships = () => async (dispatch) => {
  dispatch({ type: GET_MY_RELATIONSHIPS })
  try {
    const response = await getMyRelationshipsAPI()
    dispatch(getMyRelationshipsSuccess(response.data))
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
      dispatch(saveMyRelationshipsSuccess(response.data))
    } catch (e) {}
  }
export const saveMyRelationshipsSuccess = (response) => {
  return {
    type: SAVE_MY_RELATIONSHIPS_SUCCESS,
    payload: { data: response }
  }
}

// MY FAILURES
export const getMyFailures = () => async (dispatch) => {
  dispatch({ type: GET_MY_FAILURES })
  try {
    const response = await getMyFailuresAPI()

    dispatch(getMyFailuresSuccess(response.data))
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

// PORTFOLIO PRIVACY
export const updatePortfolioPrivacy =
  (portfolioPrivacy, type) => async (dispatch) => {
    dispatch({ type: UPDATE_PORTFOLIO_PRIVACY })
    try {
      const response = await updatePortfolioPrivacyAPI(portfolioPrivacy)
      dispatch(updatePortfolioPrivacySuccess(response.data, type))
    } catch (e) {}
  }

export const updatePortfolioPrivacySuccess = (response, type) => {
  return {
    type: UPDATE_PORTFOLIO_PRIVACY_SUCCESS,
    payload: { data: response, type }
  }
}

export const getPortfolioPrivacy = (portfolioPrivacy) => async (dispatch) => {
  dispatch({ type: GET_PORTFOLIO_PRIVACY })
  try {
    const response = await getPortfolioPrivacyAPI(portfolioPrivacy)
    dispatch(getPortfolioPrivacySuccess(response.data))
  } catch (e) {}
}

export const getPortfolioPrivacySuccess = (response) => {
  return {
    type: GET_PORTFOLIO_PRIVACY_SUCCESS,
    payload: { data: response }
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
