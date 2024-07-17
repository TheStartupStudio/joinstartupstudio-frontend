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
  GET_USER_STORY,
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
  UPDATE_PORTFOLIO_PRIVACY_SUCCESS,
  GET_PORTFOLIO_PRIVACY_SUCCESS,
  SET_VISIBILITY_MODAL_SUCCESS,
  SET_VISIBILITY_MODAL_CONTENT_SUCCESS,
  UPDATE_PORTFOLIO_PRIVACY,
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
  SHOW_ADD_FAILURE_MODAL
} from './Constants'

const initialState = {
  mode: 'preview',
  activeSection: 'who-section',
  publishModal: false,
  shareModal: false,
  publishToPeers: false,
  publishToPublic: false,
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
    userStory: {
      isLoading: false,
      data: {
        videoUrl: '',
        videoThumbnail: '',
        myStory: '',
        myValueProposition: ''
      }
    },
    myRelationships: {
      isLoading: false,
      data: {
        teamRole: '',
        collaborationStyle: '',
        leadershipPhilosophy: ''
      }
    },
    myFailures: {
      isLoading: false,
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
  }
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
      // debugger
      return {
        ...state,
        showSharePortfolioModal: payload.visibility
      }
    case SET_SHARE_MODAL_CONTENT_SUCCESS:
      // debugger
      return {
        ...state,
        showSharePortfolioModalContent: payload.content
      }
    case GET_PORTFOLIO_PRIVACY_SUCCESS:
      return {
        ...state,
        publishToPeers: payload.data.publishToPeers,
        publishToPublic: payload.data.publishToPublic
      }
    case UPDATE_PORTFOLIO_PRIVACY:
      return {
        ...state,
        showSharePortfolioModal: false
      }
    case UPDATE_PORTFOLIO_PRIVACY_SUCCESS:
      // console.log('payload', payload)
      //payload.type === 'unPublishing'
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
          userStory: {
            ...state.whoSection.userStory,
            showEditButton: payload.mode === 'edit',
            showSaveButton: payload.mode === 'preview'
          },
          myRelationships: {
            ...state.whoSection.myRelationships,
            showEditButton: payload.mode === 'edit',
            showSaveButton: payload.mode === 'preview'
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
            showEditButton: false,
            showSaveButton: true,
            isLoading: false
          }
        }
      }

    case SAVE_WHO_SECTION_SUCCESS:
      return {
        ...state,
        whoSection: { ...state.whoSection, [payload.type]: payload.data }
      }
    case SAVE_PERSONAL_BRAND_STORY_SUCCESS:
      return {
        ...state,
        whoSection: { ...state.whoSection, youtubeLink: payload.youtubeLink }
      }

    // PORTFOLIO SECTIONS
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
            isLoading: true
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
            isLoading: false
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
            isLoading: true
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
            isLoading: false
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
    case CREATE_MY_FAILURE:
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
            isLoading: false,
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
            isLoading: true
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
            isLoading: false,
            showEditFailureModal: false
          }
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
            isLoading: true
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
            isLoading: false
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
            isLoading: true
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
            isLoading: false,
            showAddMentorModal: null
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
            isLoading: true
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
            isLoading: false,
            showEditMentorModal: false
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
            isLoading: true
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
            isLoading: false
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
            isLoading: false,
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
            isLoading: true
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
            isLoading: false,
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
            isLoading: false,
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
            isLoading: true
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
            isLoading: false
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
            isLoading: false,
            error: payload.error
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
            isLoading: true
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
            isLoading: false
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
            isLoading: false,
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
