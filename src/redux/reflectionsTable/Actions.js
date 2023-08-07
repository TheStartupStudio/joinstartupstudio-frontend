import {
  SET_IS_EDIT,
  SET_CONTENT,
  SET_ACTIVE_ITEM,
  SET_SUBTITLE,
  SET_REFLECTIONS_TABLE_ENTRY,
} from './Types'

export const setSubtitle = (subtitle) => async (dispatch) => {
  dispatch({
    type: SET_SUBTITLE,
    payload: subtitle
  })
}

export const setReflectionsTableEntry = (reflectionsTableEntry) => async (dispatch) => {
  dispatch({
    type: SET_REFLECTIONS_TABLE_ENTRY,
    payload: reflectionsTableEntry
  })
}

export const setContent = (content) => async (dispatch) => {
  dispatch({
    type: SET_CONTENT,
    payload: content
  })
}

export const setActiveItem = (activeItem) => async (dispatch) => {
  dispatch({
    type: SET_ACTIVE_ITEM,
    payload: activeItem
  })
}

export const setIsEdit = (isEdit) => async (dispatch) => {
  dispatch({
    type: SET_IS_EDIT,
    payload: isEdit
  })
}
