import { COLLAPSE_TRUE, TOGGLE_COLLAPSE, TOGGLE_EDIT_PROFILE } from './Types'

export const toggleCollapse = () => ({
  type: TOGGLE_COLLAPSE
})

export const collapseTrue = () => ({
  type: COLLAPSE_TRUE
})

export const toggleEditProfile = () => ({
  type: TOGGLE_EDIT_PROFILE
})
