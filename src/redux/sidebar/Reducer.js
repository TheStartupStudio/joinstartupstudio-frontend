import { TOGGLE_COLLAPSE } from './Types'

const initialState = {
  isCollapsed: true
}

const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_COLLAPSE:
      return { ...state, isCollapsed: !state.isCollapsed }
    default:
      return state
  }
}

export default sidebarReducer
