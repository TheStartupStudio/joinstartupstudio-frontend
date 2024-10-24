import {
  CHANGE_ACTIVE_SECTION_SUCCESS,
  CHANGE_VIEW_MODE_SUCCESS,
  PUBLISH_PORTFOLIO_SECTION_SUCCESS,
  SHARE_PORTFOLIO_SECTION_SUCCESS,
  EDIT_WHO_SECTION_SUCCESS,
  SAVE_PERSONAL_BRAND_STORY_SUCCESS,
  SAVE_WHO_SECTION_SUCCESS,
  SAVE_USER_STORY_SUCCESS,
  SAVE_USER_STORY,
  GET_USER_STORY_SUCCESS,
  GET_MY_RELATIONSHIPS,
  GET_MY_RELATIONSHIPS_SUCCESS,
  SAVE_MY_RELATIONSHIPS,
  SAVE_MY_RELATIONSHIPS_SUCCESS,
  GET_MY_FAILURES,
  GET_MY_FAILURES_SUCCESS,
  SAVE_MY_FAILURES,
  SAVE_MY_FAILURES_SUCCESS,
  GET_MY_MENTORS,
  GET_MY_MENTORS_SUCCESS,
  SAVE_MY_MENTORS,
  SAVE_MY_MENTORS_SUCCESS,
  UPDATE_SHARING_SETTINGS_SUCCESS,
  GET_SHARING_SETTINGS_SUCCESS,
  SET_VISIBILITY_MODAL_SUCCESS,
  SET_VISIBILITY_MODAL_CONTENT_SUCCESS,
  UPDATE_SHARING_SETTINGS,
  SET_SHARE_MODAL_SUCCESS,
  SET_SHARE_MODAL_CONTENT_SUCCESS,
  SET_PUBLISH_MODAL_SUCCESS,
  CREATE_MY_FAILURE,
  CREATE_MY_FAILURE_SUCCESS,
  UPDATE_MY_FAILURE,
  UPDATE_MY_FAILURE_SUCCESS,
  UPDATE_MY_MENTOR_SUCCESS,
  UPDATE_MY_MENTOR,
  CREATE_MY_MENTOR_SUCCESS,
  CREATE_MY_MENTOR,
  DELETE_MY_MENTOR_ERROR,
  DELETE_MY_MENTOR_SUCCESS,
  DELETE_MY_MENTOR,
  DELETE_MY_FAILURE_ERROR,
  DELETE_MY_FAILURE_SUCCESS,
  DELETE_MY_FAILURE,
  SHOW_EDIT_MENTOR_MODAL,
  HIDE_EDIT_MENTOR_MODAL,
  DELETE_MY_MENTOR_IMAGE_ERROR,
  DELETE_MY_MENTOR_IMAGE_SUCCESS,
  DELETE_MY_MENTOR_IMAGE,
  DELETE_MY_FAILURE_IMAGE_SUCCESS,
  DELETE_MY_FAILURE_IMAGE,
  DELETE_MY_FAILURE_IMAGE_ERROR,
  HIDE_ADD_MENTOR_MODAL,
  SHOW_ADD_MENTOR_MODAL,
  SHOW_EDIT_FAILURE_MODAL,
  HIDE_EDIT_FAILURE_MODAL,
  HIDE_ADD_FAILURE_MODAL,
  SHOW_ADD_FAILURE_MODAL,
  UPDATE_SHARING_SETTINGS_ERROR,
  GET_SHARING_SETTINGS_ERROR,
  GET_SHARING_SETTINGS,
  GET_USER_STORY_ERROR,
  SAVE_USER_STORY_ERROR,
  GET_MY_FAILURES_ERROR,
  CREATE_MY_FAILURE_ERROR,
  UPDATE_MY_FAILURE_ERROR,
  GET_SKILLS,
  GET_SKILLS_SUCCESS,
  GET_MY_PROJECTS,
  GET_MY_PROJECTS_SUCCESS,
  // HOW DO I PROVE IT //
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
  HIDE_ADD_EDUCATION_MODAL,
  SHOW_EDIT_EDUCATION_MODAL,
  HIDE_EDIT_EDUCATION_MODAL,
  SHOW_ADD_EDUCATION_MODAL,
  SHOW_ADD_CREDENTIAL_MODAL,
  HIDE_ADD_CREDENTIAL_MODAL,
  SHOW_EDIT_CREDENTIAL_MODAL,
  HIDE_EDIT_CREDENTIAL_MODAL,
  UPDATE_MY_MENTOR_ERROR,
  CREATE_MY_MENTOR_ERROR,
  GET_MY_MENTORS_ERROR,
  SHOW_ADD_IMMERSION_MODAL,
  HIDE_ADD_IMMERSION_MODAL,
  SHOW_EDIT_IMMERSION_MODAL,
  HIDE_EDIT_IMMERSION_MODAL,
  SHOW_ADD_WORK_EXPERIENCE_MODAL,
  HIDE_ADD_WORK_EXPERIENCE_MODAL,
  SHOW_EDIT_WORK_EXPERIENCE_MODAL,
  HIDE_EDIT_WORK_EXPERIENCE_MODAL,
  DELETE_MY_COMPETITIVENESS_IMAGE,
  DELETE_MY_COMPETITIVENESS_IMAGE_SUCCESS,
  DELETE_MY_COMPETITIVENESS_IMAGE_ERROR,
  HIDE_EDIT_COMPETITIVENESS_MODAL,
  SHOW_EDIT_COMPETITIVENESS_MODAL,
  HIDE_ADD_COMPETITIVENESS_MODAL,
  SHOW_ADD_COMPETITIVENESS_MODAL,
  GET_BASIC_USER_INFO_SUCCESS,
  GET_BASIC_USER_INFO,
  GET_BASIC_USER_INFO_ERROR,
  GET_STUDENT_INFO_BY_ID_SUCCESS,
  GET_STUDENT_INFO_BY_ID,
  GET_STUDENT_INFO_BY_ID_ERROR,
  SAVE_BASIC_USER_INFO,
  SAVE_BASIC_USER_INFO_SUCCESS,
  SAVE_BASIC_USER_INFO_ERROR,
  GET_USER_STORY,
  SHOW_EDIT_MY_STORY_MODAL,
  HIDE_EDIT_MY_STORY_MODAL,
  SHOW_ADD_MY_STORY_MODAL,
  HIDE_ADD_MY_STORY_MODAL,
  HIDE_EDIT_USER_BASIC_INFO_MODAL,
  SHOW_EDIT_USER_BASIC_INFO_MODAL,
  HIDE_ADD_USER_BASIC_INFO_MODAL,
  SHOW_ADD_USER_BASIC_INFO_MODAL,
  TOGGLE_USER_STORY_SUCCESS,
  TOGGLE_USER_STORY,
  TOGGLE_MY_RELATIONSHIPS_SUCCESS,
  TOGGLE_MY_RELATIONSHIPS,
  TOGGLE_MY_FAILURE,
  TOGGLE_MY_FAILURE_SUCCESS
} from './Constants'

const initialState = {
  mode: 'preview',
  activeSection: 'who-section',
  publishModal: false,
  shareModal: false,
  sharingSettings: {
    isPeerShared: false,
    isPublicShared: false
  },
  areLoadingSharingSettings: false,
  error: {},
  publishPortfolioModal: false,
  confirmVisibilityModal: false,
  confirmVisibilityModalContent: {
    title: '',
    description: '',
    containCheckBox: '',
    checkboxContent: '',
    actionTitle: '',
    action: null
  },
  showSharePortfolioModal: false,
  sharePortfolioModalContent: { description: '' },
  whoSection: {
    userBasicInfo: {
      addModal: false,
      editModal: false,
      isLoading: false,
      isSaving: false,
      error: null,
      data: {
        videoUrl: '',
        videoThumbnail: '',
        myValueProposition: ''
      }
    },
    userStory: {
      addModal: false,
      editModal: false,
      isLoading: false,
      isSaving: false,
      isTogglingSection: false,
      error: null,
      data: {
        story: ''
      }
    },
    myRelationships: {
      isLoading: false,
      isSaving: false,
      error: null,
      isTogglingSection: false,
      data: {
        teamRole: '',
        collaborationStyle: '',
        leadershipPhilosophy: ''
      }
    },
    myFailures: {
      isLoading: false,
      isSaving: false,
      error: null,
      showEditFailureModal: null,
      showAddFailureModal: null,
      data: [
        {
          videoUrl: '',
          videoThumbnail: '',
          assessment: '',
          outcome: ''
        }
      ]
    },
    myMentors: {
      isLoading: false,
      isSaving: false,
      error: null,
      showEditMentorModal: null,
      showAddMentorModal: null,
      data: [
        {
          mentorName: '',
          mentorImage: '',
          mentorRole: '',
          mentorCompany: '',
          mentorDescription: ''
        }
      ]
    }
  },
  skills: [],
  whatSection: {
    myProjects: {
      isLoading: false,
      isSaving: false,
      error: null,
      // data: []
      data: []
    }
  },
  howSection: {
    myAlignments: {
      educations: {
        isLoading: false,
        isSaving: false,
        error: null,
        showEditModal: null,
        showAddModal: null,
        data: []
      },
      credentials: {
        isLoading: false,
        isSaving: false,
        error: null,
        showEditModal: null,
        showAddModal: null,
        data: []
      }
    },
    myProductivity: {
      workExperiences: {
        isLoading: false,
        isSaving: false,
        error: null,
        showEditModal: null,
        showAddModal: null,
        data: []
      },
      immersions: {
        isLoading: false,
        isSaving: false,
        error: null,
        showEditModal: null,
        showAddModal: null,
        data: []
      }
    },
    myCompetitiveness: {
      isLoading: false,
      isSaving: false,
      error: null,
      showEditCompetitivenessModal: null,
      showAddCompetitivenessModal: null,
      data: []
    }
  },

}

const portfolioReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_PUBLISH_MODAL_SUCCESS:
      return {
        ...state,
        publishPortfolioModal: payload.visibility
      }
    case SET_VISIBILITY_MODAL_SUCCESS:
      return {
        ...state,
        confirmVisibilityModal: payload.visibility
      }
    case SET_VISIBILITY_MODAL_CONTENT_SUCCESS:
      return {
        ...state,
        confirmVisibilityModalContent: payload.content
      }
    case SET_SHARE_MODAL_SUCCESS:
      return {
        ...state,
        showSharePortfolioModal: payload.visibility
      }
    case SET_SHARE_MODAL_CONTENT_SUCCESS:
      return {
        ...state,
        showSharePortfolioModalContent: payload.content
      }
    case GET_SHARING_SETTINGS:
      return {
        ...state,
        areLoadingSharingSettings: true
      }
    case GET_SHARING_SETTINGS_SUCCESS:
      return {
        ...state,
        sharingSettings: payload.data,
        areLoadingSharingSettings: false
      }

    case GET_SHARING_SETTINGS_ERROR:
      return {
        ...state,
        error: payload.error,
        areLoadingSharingSettings: false
      }
    case UPDATE_SHARING_SETTINGS:
      return {
        ...state,
        showSharePortfolioModal: false
      }
    case UPDATE_SHARING_SETTINGS_SUCCESS:
      return {
        ...state,
        sharingSettings: payload.data,
        showSharePortfolioModal: payload.type !== 'unPublishing',
        confirmVisibilityModal: false,
        publishPortfolioModal: false
      }
    case UPDATE_SHARING_SETTINGS_ERROR:
      return {
        ...state,
        publishToPeers: payload.data.publishToPeers,
        publishToPublic: payload.data.publishToPublic,
        showSharePortfolioModal: payload.type !== 'unPublishing',
        confirmVisibilityModal: false,
        publishPortfolioModal: false
      }
    case CHANGE_VIEW_MODE_SUCCESS:
      return {
        ...state,
        mode: payload.mode,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo
          },
          userStory: {
            ...state.whoSection.userStory
          },
          myRelationships: {
            ...state.whoSection.myRelationships
          }
        }
      }
    case CHANGE_ACTIVE_SECTION_SUCCESS:
      return {
        ...state,
        activeSection: payload.section
      }
    case PUBLISH_PORTFOLIO_SECTION_SUCCESS:
      return {
        ...state,
        publishModal: payload.publish
      }
    case SHARE_PORTFOLIO_SECTION_SUCCESS:
      return {
        ...state,
        shareModal: payload.share
      }

    case EDIT_WHO_SECTION_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          [payload.type]: {
            ...state.whoSection[payload.type],
            isLoading: false
          }
        }
      }

    // PORTFOLIO SECTIONS
    case GET_BASIC_USER_INFO:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            isLoading: true
          }
        }
      }
    case GET_BASIC_USER_INFO_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            data: payload.data,
            isLoading: false
          }
        }
      }
    case GET_BASIC_USER_INFO_ERROR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            data: payload.error,
            isLoading: false
          }
        }
      }



    case SAVE_BASIC_USER_INFO:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            isSaving: true
          }
        }
      }
    case SAVE_BASIC_USER_INFO_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            data: payload.data,
            isSaving: false,
            addModal: false,
            editModal: false
          }
        }
      }
    case SAVE_BASIC_USER_INFO_ERROR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            error: payload.error,
            isSaving: false
          }
        }
      }
    case GET_MY_RELATIONSHIPS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myRelationships: {
            ...state.whoSection.myRelationships,
            isLoading: true
          }
        }
      }
    case GET_MY_RELATIONSHIPS_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myRelationships: {
            ...state.whoSection.myRelationships,
            data: payload.data,
            showEditButton: true,
            showSaveButton: false,
            isLoading: false
          }
        }
      }
    case SAVE_MY_RELATIONSHIPS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myRelationships: {
            ...state.whoSection.myRelationships,
            isSaving: true
          }
        }
      }
    case SAVE_MY_RELATIONSHIPS_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myRelationships: {
            ...state.whoSection.myRelationships,
            data: payload.data,
            isSaving: false
          }
        }
      }

    case TOGGLE_MY_RELATIONSHIPS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myRelationships: {
            ...state.whoSection.myRelationships
            // isTogglingSection: true
          }
        }
      }
    case TOGGLE_MY_RELATIONSHIPS_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myRelationships: {
            ...state.whoSection.myRelationships,
            data: payload.data
            // isTogglingSection: false
          }
        }
      }
    case GET_USER_STORY:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            isLoading: true
          }
        }
      }
    case GET_USER_STORY_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            data: payload.data,
            isLoading: false
          }
        }
      }
    case SAVE_USER_STORY:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            isSaving: true
          }
        }
      }
    case SAVE_USER_STORY_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            data: payload.data,
            isSaving: false,
            editModal: false,
            addModal: false
          }
        }
      }

    case TOGGLE_USER_STORY:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            isTogglingSection: true
          }
        }
      }
    case TOGGLE_USER_STORY_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            data: payload.data,
            isTogglingSection: false
          }
        }
      }

    // USER BASIC INFO MODAL:

    case SHOW_ADD_USER_BASIC_INFO_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            addModal: true
          }
        }
      }
    case HIDE_ADD_USER_BASIC_INFO_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            addModal: false
          }
        }
      }

    case SHOW_EDIT_USER_BASIC_INFO_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            editModal: true
          }
        }
      }
    case HIDE_EDIT_USER_BASIC_INFO_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userBasicInfo: {
            ...state.whoSection.userBasicInfo,
            editModal: false
          }
        }
      }

    // MY STORY MODAL:

    case SHOW_ADD_MY_STORY_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            addModal: true
          }
        }
      }
    case HIDE_ADD_MY_STORY_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            addModal: false
          }
        }
      }

    case SHOW_EDIT_MY_STORY_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            editModal: true
          }
        }
      }
    case HIDE_EDIT_MY_STORY_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          userStory: {
            ...state.whoSection.userStory,
            editModal: false
          }
        }
      }
    // MY FAILURES
    case SHOW_ADD_FAILURE_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            showAddFailureModal: true
          }
        }
      }
    case HIDE_ADD_FAILURE_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            showAddFailureModal: null
          }
        }
      }

    case SHOW_EDIT_FAILURE_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            showEditFailureModal: action.payload
          }
        }
      }
    case HIDE_EDIT_FAILURE_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            showEditFailureModal: null
          }
        }
      }
    case GET_MY_FAILURES:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isLoading: true
          }
        }
      }
    case GET_MY_FAILURES_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            data: payload.data,
            isLoading: false
          }
        }
      }
    case GET_MY_FAILURES_ERROR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            error: payload.error,
            isLoading: false
          }
        }
      }
    case CREATE_MY_FAILURE:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isSaving: true
          }
        }
      }
    case CREATE_MY_FAILURE_SUCCESS: {
      const existingData = state.whoSection.myFailures.data
      const { data } = payload

      const updatedData = createRow(existingData, data)

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            data: updatedData,
            isSaving: false,
            showAddFailureModal: false,
            error: null
          }
        }
      }
    }

    case CREATE_MY_FAILURE_ERROR: {
      const { error } = payload

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isSaving: false,
            error: error,
            showAddFailureModal: false
          }
        }
      }
    }
    case UPDATE_MY_FAILURE:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isSaving: true
          }
        }
      }
    case UPDATE_MY_FAILURE_SUCCESS: {
      const existingData = state.whoSection.myFailures.data
      const { id, data } = payload
      const updatedData = updateRow(existingData, id, data)
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            data: updatedData,
            isSaving: false,
            showEditFailureModal: false
          }
        }
      }
    }
    case UPDATE_MY_FAILURE_ERROR: {
      const { error } = payload

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isSaving: false,
            error: error,
            showEditFailureModal: false
          }
        }
      }
    }

    case TOGGLE_MY_FAILURE:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isTogglingSection: true
          }
        }
      }
    case TOGGLE_MY_FAILURE_SUCCESS:
      const existingData = state.whoSection.myFailures.data
      const { id, data } = payload
      const updatedData = updateRow(existingData, id, data)
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            data: updatedData,
            isTogglingSection: false
          }
        }
      }

    // MY MENTORS

    case SHOW_ADD_MENTOR_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            showAddMentorModal: true
          }
        }
      }
    case HIDE_ADD_MENTOR_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            showAddMentorModal: null
          }
        }
      }

    case SHOW_EDIT_MENTOR_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            showEditMentorModal: action.payload
          }
        }
      }
    case HIDE_EDIT_MENTOR_MODAL:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            showEditMentorModal: null
          }
        }
      }
    case GET_MY_MENTORS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isLoading: true,
            error: null
          }
        }
      }
    case GET_MY_MENTORS_SUCCESS:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            data: payload.data,
            isLoading: false,
            error: null
          }
        }
      }
    case GET_MY_MENTORS_ERROR: {
      const { error } = payload
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isLoading: false,
            error: error
          }
        }
      }
    }
    case CREATE_MY_MENTOR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isSaving: true,
            error: null
          }
        }
      }

    case CREATE_MY_MENTOR_SUCCESS: {
      const existingData = state.whoSection.myMentors.data
      const { data } = payload

      const updatedData = createRow(existingData, data)

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            data: updatedData,
            isSaving: false,
            showAddMentorModal: null,
            error: null
          }
        }
      }
    }

    case CREATE_MY_MENTOR_ERROR: {
      const { error } = payload
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isSaving: false,
            error: error
          }
        }
      }
    }

    case UPDATE_MY_MENTOR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isSaving: true,
            error: null
          }
        }
      }

    case UPDATE_MY_MENTOR_SUCCESS: {
      const existingData = state.whoSection.myMentors.data
      const { id, data } = payload
      const updatedData = updateRow(existingData, id, data)

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            data: updatedData,
            isSaving: false,
            showEditMentorModal: false,
            error: null
          }
        }
      }
    }

    case UPDATE_MY_MENTOR_ERROR: {
      const { error } = payload
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isSaving: false,
            error: error
          }
        }
      }
    }

    case DELETE_MY_MENTOR_IMAGE:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isSaving: true
          }
        }
      }

    case DELETE_MY_MENTOR_IMAGE_SUCCESS: {
      const existingData = state.whoSection.myMentors.data
      const { id, data } = payload
      const updatedData = updateRow(existingData, id, data)

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            data: updatedData,
            isSaving: false
          }
        }
      }
    }

    case DELETE_MY_MENTOR_IMAGE_ERROR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isSaving: false,
            error: payload.error
          }
        }
      }

    case DELETE_MY_MENTOR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isSaving: true
          }
        }
      }

    case DELETE_MY_MENTOR_SUCCESS: {
      const existingData = state.whoSection.myMentors.data
      const { id } = payload
      const updatedData = removeRow(existingData, id)

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            data: updatedData,
            isSaving: false,
            showMentorModal: false
          }
        }
      }
    }

    case DELETE_MY_MENTOR_ERROR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myMentors: {
            ...state.whoSection.myMentors,
            isSaving: false,
            error: payload.error
          }
        }
      }

    case DELETE_MY_FAILURE:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isSaving: true
          }
        }
      }

    case DELETE_MY_FAILURE_SUCCESS: {
      const existingData = state.whoSection.myFailures.data
      const { id } = payload
      const updatedData = removeRow(existingData, id)

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            data: updatedData,
            isSaving: false,
            showEditFailureModal: false,
            showAddFailureModal: false
          }
        }
      }
    }

    case DELETE_MY_FAILURE_ERROR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isSaving: false,
            error: payload.error,
            showEditFailureModal: false,
            showAddFailureModal: false
          }
        }
      }

    case DELETE_MY_FAILURE_IMAGE:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isSaving: true
          }
        }
      }

    case DELETE_MY_FAILURE_IMAGE_SUCCESS: {
      const existingData = state.whoSection.myFailures.data
      const { id, data } = payload
      const updatedData = updateRow(existingData, id, data)

      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            data: updatedData,
            isSaving: false
          }
        }
      }
    }

    case DELETE_MY_FAILURE_IMAGE_ERROR:
      return {
        ...state,
        whoSection: {
          ...state.whoSection,
          myFailures: {
            ...state.whoSection.myFailures,
            isSaving: false,
            error: payload.error
          }
        }
      }

    ////////////////////// WHAT CAN I DO /////////////////////////
    case GET_SKILLS:
      return {
        ...state
      }
    case GET_SKILLS_SUCCESS:
      return {
        ...state,
        skills: payload.data
      }

    case GET_MY_PROJECTS:
      return {
        ...state
      }
    case GET_MY_PROJECTS_SUCCESS:
      return {
        ...state,
        whatSection: {
          ...state.whatSection,
          myProjects: {
            ...state.whatSection.myProjects,
            data: payload.data
          }
        }
      }

    ///////////////// HOW DO I PROVE IT ////////////////////

    case SHOW_ADD_EDUCATION_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            educations: {
              ...state.howSection?.myAlignments?.educations,
              error: null,
              showAddModal: true
            }
          }
        }
      }
    case HIDE_ADD_EDUCATION_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            educations: {
              ...state.howSection?.myAlignments?.educations,
              error: null,
              showAddModal: null
            }
          }
        }
      }

    case SHOW_EDIT_EDUCATION_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            educations: {
              ...state.howSection?.myAlignments?.educations,
              showEditModal: action.payload
            }
          }
        }
      }
    case HIDE_EDIT_EDUCATION_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            educations: {
              ...state.howSection?.myAlignments?.educations,
              showEditModal: null
            }
          }
        }
      }

    case SHOW_ADD_CREDENTIAL_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              showAddModal: true
            }
          }
        }
      }
    case HIDE_ADD_CREDENTIAL_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              showAddModal: null
            }
          }
        }
      }

    case SHOW_EDIT_CREDENTIAL_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              error: null,
              showEditModal: action.payload
            }
          }
        }
      }
    case HIDE_EDIT_CREDENTIAL_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              error: null,
              showEditModal: null
            }
          }
        }
      }

    case GET_MY_EDUCATIONS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            educations: {
              ...state.howSection?.myAlignments?.educations,
              isLoading: true,
              error: null
            }
          }
        }
      }
    case GET_MY_EDUCATIONS_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            educations: {
              ...state.howSection?.myAlignments?.educations,
              isLoading: false,
              error: null,
              data: payload.data
            }
          }
        }
      }
    case GET_MY_EDUCATIONS_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            educations: {
              ...state.howSection?.myAlignments?.educations,
              isLoading: false,
              error: payload.error
            }
          }
        }
      }

    case UPDATE_MY_EDUCATION:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            educations: {
              ...state.howSection?.myAlignments?.educations,
              isSaving: true,
              error: null
            }
          }
        }
      }

    case UPDATE_MY_EDUCATION_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection.myAlignments,
            educations: {
              ...state.howSection.myAlignments.educations,
              isSaving: false,
              data: updateRow(
                state.howSection.myAlignments.educations.data,
                payload.data.id,
                payload.data
              ),
              showEditModal: false
            }
          }
        }
      }
    case UPDATE_MY_EDUCATION_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection.myAlignments,
            educations: {
              ...state.howSection.myAlignments.educations,
              isSaving: false,
              error: payload.error,
              showEditModal: false
            }
          }
        }
      }

    case ADD_MY_EDUCATION:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection.myAlignments,
            educations: {
              ...state.howSection.myAlignments.educations,
              isSaving: true,
              error: null,
              showEditModal: false
            }
          }
        }
      }
    case ADD_MY_EDUCATION_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection.myAlignments,
            educations: {
              ...state.howSection.myAlignments.educations,
              isSaving: false,
              data: createRow(
                state.howSection.myAlignments.educations.data,
                payload.data
              ),
              showAddModal: false
            }
          }
        }
      }
    case ADD_MY_EDUCATION_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection.myAlignments,
            educations: {
              ...state.howSection.myAlignments.educations,
              isSaving: false,
              error: action.payload.error,
              showAddModal: false
            }
          }
        }
      }

    case DELETE_MY_EDUCATION:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection.myAlignments,
            educations: {
              ...state.howSection.myAlignments.educations,
              error: null
            }
          }
        }
      }
    case DELETE_MY_EDUCATION_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection.myAlignments,
            educations: {
              ...state.howSection.myAlignments.educations,
              data: removeRow(
                state.howSection.myAlignments.educations.data,
                payload.data.id
              ),
              showEditModal: false
            }
          }
        }
      }
    case DELETE_MY_EDUCATION_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection.myAlignments,
            educations: {
              ...state.howSection.myAlignments.educations,
              error: payload.error,
              showEditModal: false
            }
          }
        }
      }

    // Credentials cases
    case GET_MY_CREDENTIALS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isLoading: true,
              error: null
            }
          }
        }
      }

    case GET_MY_CREDENTIALS_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isLoading: false,
              error: null,
              data: payload.data
            }
          }
        }
      }
    case GET_MY_CREDENTIALS_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isLoading: false,
              error: payload.error
            }
          }
        }
      }

    case UPDATE_MY_CREDENTIAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isSaving: true,
              error: null
            }
          }
        }
      }
    case UPDATE_MY_CREDENTIAL_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isSaving: false,
              showEditModal: false,
              data: updateRow(
                state.howSection.myAlignments.credentials.data,
                payload.data.id,
                payload.data
              )
            }
          }
        }
      }
    case UPDATE_MY_CREDENTIAL_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isSaving: false,
              error: payload.error,
              showEditModal: false
            }
          }
        }
      }

    case ADD_MY_CREDENTIAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isSaving: true,
              error: null
            }
          }
        }
      }
    case ADD_MY_CREDENTIAL_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isSaving: false,
              data: createRow(
                state.howSection.myAlignments.credentials.data,
                payload.data
              ),
              showAddModal: false
            }
          }
        }
      }
    case ADD_MY_CREDENTIAL_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              isSaving: false,
              error: payload.error,
              showAddModal: false
            }
          }
        }
      }

    case DELETE_MY_CREDENTIAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              error: null
            }
          }
        }
      }
    case DELETE_MY_CREDENTIAL_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              data: removeRow(
                state.howSection.myAlignments.credentials.data,
                payload.data.id
              ),
              showEditModal: false
            }
          }
        }
      }
    case DELETE_MY_CREDENTIAL_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myAlignments: {
            ...state.howSection?.myAlignments,
            credentials: {
              ...state.howSection?.myAlignments?.credentials,
              error: action.payload.error,
              showEditModal: false
            }
          }
        }
      }

    // MY PRODUCTIVITY MODALS

    case SHOW_ADD_IMMERSION_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            immersions: {
              ...state.howSection?.myProductivity?.immersions,
              showAddModal: true
            }
          }
        }
      }
    case HIDE_ADD_IMMERSION_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            immersions: {
              ...state.howSection?.myProductivity?.immersions,
              showAddModal: null
            }
          }
        }
      }

    case SHOW_EDIT_IMMERSION_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            immersions: {
              ...state.howSection?.myProductivity?.immersions,
              showEditModal: action.payload
            }
          }
        }
      }
    case HIDE_EDIT_IMMERSION_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            immersions: {
              ...state.howSection?.myProductivity?.immersions,
              showEditModal: null
            }
          }
        }
      }

    case SHOW_ADD_WORK_EXPERIENCE_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            workExperiences: {
              ...state.howSection?.myProductivity?.workExperiences,
              showAddModal: true
            }
          }
        }
      }
    case HIDE_ADD_WORK_EXPERIENCE_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            workExperiences: {
              ...state.howSection?.myProductivity?.workExperiences,
              showAddModal: null
            }
          }
        }
      }

    case SHOW_EDIT_WORK_EXPERIENCE_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            workExperiences: {
              ...state.howSection?.myProductivity?.workExperiences,
              showEditModal: action.payload
            }
          }
        }
      }
    case HIDE_EDIT_WORK_EXPERIENCE_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            workExperiences: {
              ...state.howSection?.myProductivity?.workExperiences,
              showEditModal: null
            }
          }
        }
      }

    // Immersions cases
    case GET_MY_IMMERSIONS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            immersions: {
              isLoading: true,
              error: null,
              data: state.howSection?.myProductivity?.immersions?.data || []
            }
          }
        }
      }
    case GET_MY_IMMERSIONS_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            immersions: {
              isLoading: false,
              data: payload.data
            }
          }
        }
      }
    case GET_MY_IMMERSIONS_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            immersions: {
              isLoading: false,
              error: payload.error,
              data: state.howSection?.myProductivity?.immersions?.data || []
            }
          }
        }
      }

    case UPDATE_MY_IMMERSION:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              isSaving: true,
              error: null
            }
          }
        }
      }
    case UPDATE_MY_IMMERSION_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              isSaving: false,
              data: updateRow(
                state.howSection.myProductivity.immersions.data,
                payload.data.id,
                payload.data
              ),
              showEditModal: null
            }
          }
        }
      }
    case UPDATE_MY_IMMERSION_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              isSaving: false,
              error: payload.error,
              showEditModal: false
            }
          }
        }
      }

    case ADD_MY_IMMERSION:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              isSaving: true,
              error: null
            }
          }
        }
      }
    case ADD_MY_IMMERSION_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              isSaving: false,
              data: createRow(
                state.howSection.myProductivity.immersions.data,
                payload.data
              ),
              showAddModal: null
            }
          }
        }
      }
    case ADD_MY_IMMERSION_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              isSaving: false,
              error: payload.error,
              showAddModal: null
            }
          }
        }
      }

    case DELETE_MY_IMMERSION:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              error: null
            }
          }
        }
      }
    case DELETE_MY_IMMERSION_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              data: removeRow(
                state.howSection.myProductivity.immersions.data,
                payload.data.id
              ),
              showEditModal: null
            }
          }
        }
      }
    case DELETE_MY_IMMERSION_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            immersions: {
              ...state.howSection.myProductivity.immersions,
              error: payload.error,
              showEditModal: null
            }
          }
        }
      }

    // Work Experience cases
    case GET_MY_WORK_EXPERIENCES:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            workExperiences: {
              isLoading: true,
              error: null,
              data:
                state.howSection?.myProductivity?.workExperiences?.data || []
            }
          }
        }
      }
    case GET_MY_WORK_EXPERIENCES_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            workExperiences: {
              isLoading: false,
              data: payload.data
            }
          }
        }
      }
    case GET_MY_WORK_EXPERIENCES_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection?.myProductivity,
            workExperiences: {
              isLoading: false,
              error: payload.error,
              data:
                state.howSection?.myProductivity?.workExperiences?.data || []
            }
          }
        }
      }
    case UPDATE_MY_WORK_EXPERIENCE:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              isSaving: true,
              error: null
            }
          }
        }
      }
    case UPDATE_MY_WORK_EXPERIENCE_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              isSaving: false,
              data: updateRow(
                state.howSection.myProductivity.workExperiences.data,
                payload.data.id,
                payload.data
              ),
              showEditModal: null
            }
          }
        }
      }
    case UPDATE_MY_WORK_EXPERIENCE_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              isSaving: false,
              error: payload.error,
              showEditModal: null
            }
          }
        }
      }

    case ADD_MY_WORK_EXPERIENCE:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              isSaving: true,
              error: null
            }
          }
        }
      }
    case ADD_MY_WORK_EXPERIENCE_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              isSaving: false,
              data: createRow(
                state.howSection.myProductivity.workExperiences.data,
                payload.data
              ),
              showAddModal: null
            }
          }
        }
      }
    case ADD_MY_WORK_EXPERIENCE_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              isSaving: false,
              error: action.payload.error,
              showAddModal: null
            }
          }
        }
      }

    case DELETE_MY_WORK_EXPERIENCE:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              error: null
            }
          }
        }
      }
    case DELETE_MY_WORK_EXPERIENCE_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              data: removeRow(
                state.howSection.myProductivity.workExperiences.data,
                payload.data.id
              ),
              showEditModal: null
            }
          }
        }
      }
    case DELETE_MY_WORK_EXPERIENCE_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myProductivity: {
            ...state.howSection.myProductivity,
            workExperiences: {
              ...state.howSection.myProductivity.workExperiences,
              error: payload.error,
              showEditModal: null
            }
          }
        }
      }
    // MY COMPETITIVENESS

    case SHOW_ADD_COMPETITIVENESS_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            showAddCompetitivenessModal: true
          }
        }
      }
    case HIDE_ADD_COMPETITIVENESS_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            showAddCompetitivenessModal: null
          }
        }
      }

    case SHOW_EDIT_COMPETITIVENESS_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            showEditCompetitivenessModal: action.payload
          }
        }
      }
    case HIDE_EDIT_COMPETITIVENESS_MODAL:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            showEditCompetitivenessModal: null
          }
        }
      }
    case GET_MY_COMPETITIVENESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isLoading: true,
            error: null
          }
        }
      }
    case GET_MY_COMPETITIVENESS_SUCCESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            data: payload.data,
            isLoading: false,
            error: null
          }
        }
      }
    case GET_MY_COMPETITIVENESS_ERROR: {
      const { error } = payload
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isLoading: false,
            error: error
          }
        }
      }
    }
    case ADD_MY_COMPETITIVENESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isSaving: true,
            error: null
          }
        }
      }

    case ADD_MY_COMPETITIVENESS_SUCCESS: {
      const existingData = state.howSection.myCompetitiveness.data
      const { data } = payload

      const updatedData = createRow(existingData, data)
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            data: updatedData,
            isSaving: false,
            showAddCompetitivenessModal: null,
            error: null
          }
        }
      }
    }

    case ADD_MY_COMPETITIVENESS_ERROR: {
      const { error } = payload
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isSaving: false,
            error: error
          }
        }
      }
    }

    case UPDATE_MY_COMPETITIVENESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isSaving: true,
            error: null
          }
        }
      }

    case UPDATE_MY_COMPETITIVENESS_SUCCESS: {
      const existingData = state.howSection.myCompetitiveness.data
      const { data, category } = payload

      const updatedData = updateRow(existingData, data?.id, data)

      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            data: updatedData,
            isSaving: false,
            showEditCompetitivenessModal: null,
            error: null
          }
        }
      }
    }

    case UPDATE_MY_COMPETITIVENESS_ERROR: {
      const { error } = payload
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isSaving: false,
            error: error
          }
        }
      }
    }

    case DELETE_MY_COMPETITIVENESS_IMAGE:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isSaving: true
          }
        }
      }

    case DELETE_MY_COMPETITIVENESS_IMAGE_SUCCESS: {
      const existingData = state.howSection.myCompetitiveness.data
      const { data } = payload
      const updatedData = updateRow(existingData, data.id, data)

      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            data: updatedData,
            isSaving: false
          }
        }
      }
    }

    case DELETE_MY_COMPETITIVENESS_IMAGE_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isSaving: false,
            error: payload.error
          }
        }
      }

    case DELETE_MY_COMPETITIVENESS:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isSaving: true
          }
        }
      }

    case DELETE_MY_COMPETITIVENESS_SUCCESS: {
      const existingData = state.howSection.myCompetitiveness.data
      const { id, data } = payload
      const updatedData = removeRow(existingData, id)

      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            data: updatedData,
            isSaving: false,
            showCompetitivenessModal: null
          }
        }
      }
    }

    case DELETE_MY_COMPETITIVENESS_ERROR:
      return {
        ...state,
        howSection: {
          ...state.howSection,
          myCompetitiveness: {
            ...state.howSection.myCompetitiveness,
            isSaving: false,
            error: payload.error
          }
        }
      }

    default:
      return state
  }
}

export default portfolioReducer

const createRow = (existingData, newData) => {
  return [...existingData, newData]
}

const updateRow = (existingData, id, newData) => {
  const itemIndex = existingData.findIndex((item) => item.id === id)

  return itemIndex !== -1
    ? existingData.map((item, idx) =>
        idx === itemIndex ? { ...item, ...newData } : item
      )
    : existingData
}
const removeRow = (existingData, id) => {
  return existingData.filter((item) => item.id !== id)
}
