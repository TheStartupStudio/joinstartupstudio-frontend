import * as types from './Types'

const initialState = {
  domain: null,
  logo: null,
  banner: null,
  loading: false,
  error: null
}

const organizationBrandingReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_ORGANIZATION_BRANDING_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.GET_ORGANIZATION_BRANDING_SUCCESS:
      return {
        ...state,
        domain: payload.domain,
        logo: payload.logo,
        banner: payload.banner,
        loading: false,
        error: null
      }
    case types.GET_ORGANIZATION_BRANDING_ERROR:
      return {
        ...state,
        loading: false,
        error: payload?.message ?? 'Unknown error'
      }
    case types.LOAD_ORGANIZATION_BRANDING_FROM_CACHE:
      return {
        ...state,
        domain: payload?.domain ?? state.domain,
        logo: payload?.logo ?? state.logo,
        banner: payload?.banner ?? state.banner,
        error: null
      }
    case types.CLEAR_ORGANIZATION_BRANDING:
      return { ...initialState }
    default:
      return state
  }
}

export default organizationBrandingReducer
