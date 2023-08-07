import {
  SET_IS_EDIT,
  SET_CONTENT,
  SET_ACTIVE_ITEM,
  SET_SUBTITLE,
  SET_REFLECTIONS_TABLE_ENTRY
} from './Types'

const initialState = {
  isEdit: false,
  content: null,
  activeItem: null,
  reflectionsTableEntry: null,
  subtitle: null
}

const reflectionsTableReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_IS_EDIT:
      return {
        ...state,
        isEdit: payload
      }

    case SET_CONTENT:
      return {
        ...state,
        content: payload
      }

    case SET_ACTIVE_ITEM:
      return {
        ...state,
        activeItem: payload
      }

    case SET_REFLECTIONS_TABLE_ENTRY:
      return {
        ...state,
        reflectionsTableEntry: payload
      }

    case SET_SUBTITLE:
      return {
        ...state,
        subtitle: payload
      }

    default:
      return state
  }
}

export default reflectionsTableReducer
