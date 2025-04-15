import { COLLAPSE_TRUE, TOGGLE_COLLAPSE, TOGGLE_EDIT_PROFILE } from './Types'

const initialState = {
  isCollapsed: true,
  showEditProfileForm: false
}

const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_COLLAPSE:
      return { ...state, isCollapsed: !state.isCollapsed }
    case COLLAPSE_TRUE:
      return { ...state, isCollapsed: true }
    case TOGGLE_EDIT_PROFILE:
      return { ...state, showEditProfileForm: !state.showEditProfileForm }
    default:
      return state
  }
}

export default sidebarReducer
