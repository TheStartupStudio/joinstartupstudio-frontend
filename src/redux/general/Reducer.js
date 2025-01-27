import {
  CHANGE_SIDEBAR_STATE,
  SET_ACCORDION_TOGGLED,
  SET_IMAGE_CROPPER_DATA,
  SET_CROPPED_IMAGE,
  GENERAL_LOADING,
  SET_MY_INBOX_HASH
} from './Types'

const INIT_STATE = {
  sidebarState: false,
  isAccordionToggled: false,
  imageCropperData: null,
  croppedImage: null,
  generalLoading: false,
  myInboxHash: ""
}

const generalReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_SIDEBAR_STATE:
      return { ...state, sidebarState: action.payload }

    case SET_ACCORDION_TOGGLED:
      return { ...state, isAccordionToggled: action.payload }

          case SET_MY_INBOX_HASH:
            return { ...state, myInboxHash: action.payload }

    case SET_IMAGE_CROPPER_DATA:
      return { ...state, imageCropperData: action.payload }
    case SET_CROPPED_IMAGE:
      return { ...state, croppedImage: action.payload }

    case GENERAL_LOADING:
      return { ...state, generalLoading: action.payload }

    default:
      return { ...state }
  }
}

export default generalReducer
