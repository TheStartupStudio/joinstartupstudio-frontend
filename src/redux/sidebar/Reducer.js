import { COLLAPSE_TRUE, TOGGLE_COLLAPSE } from './Types'

const initialState = {
  isCollapsed: true
}

const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_COLLAPSE:
      return { ...state, isCollapsed: !state.isCollapsed }
    case COLLAPSE_TRUE:
      return { ...state, isCollapsed: true }
    default:
      return state
  }
}

export default sidebarReducer
