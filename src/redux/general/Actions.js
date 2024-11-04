import {
  CHANGE_SIDEBAR_STATE,
  SET_ACCORDION_TOGGLED,
  SET_IMAGE_CROPPER_DATA,
  SET_CROPPED_IMAGE,
  GENERAL_LOGIN
} from './Types'

export const changeSidebarState = (state) => {
  return {
    type: CHANGE_SIDEBAR_STATE,
    payload: state
  }
}

export const setAccordionToggled = (state) => {
  return {
    type: SET_ACCORDION_TOGGLED,
    payload: state
  }
}

export const setImageCropperData = (state) => {
  return {
    type: SET_IMAGE_CROPPER_DATA,
    payload: state
  }
}

export const setCroppedImage = (state) => {
  return {
    type: SET_CROPPED_IMAGE,
    payload: state
  }
}

export const setGeneralLoading = (state) => {
  return {
    type: GENERAL_LOGIN,
    payload: state
  }
}
