import * as types from './Types'
import { getOrganizationBrandingByDomain } from './Service'

const ORGANIZATION_BRANDING_STORAGE_KEY = 'organizationBranding'

function normalizeDomain (domain) {
  const d = (domain || '').toString().trim().toLowerCase()
  return d.replace(/^www\./, '')
}

export const loadOrganizationBrandingFromCache = () => (dispatch) => {
  try {
    const raw = typeof window !== 'undefined' && window.localStorage.getItem(ORGANIZATION_BRANDING_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    const currentDomain = normalizeDomain(typeof window !== 'undefined' && window.location.hostname)
    const cachedDomain = normalizeDomain(parsed?.domain)
    if (parsed && cachedDomain && cachedDomain === currentDomain) {
      dispatch({
        type: types.LOAD_ORGANIZATION_BRANDING_FROM_CACHE,
        payload: {
          domain: parsed.domain,
          logo: parsed.logo ?? null,
          banner: parsed.banner ?? null
        }
      })
    }
  } catch (_) {
    // ignore invalid cache
  }
}

export const fetchOrganizationBranding = (domain) => async (dispatch) => {
  const rawDomain = (domain || '').toString().trim()
  if (!rawDomain) {
    dispatch({
      type: types.GET_ORGANIZATION_BRANDING_ERROR,
      payload: { message: 'Domain is required' }
    })
    return
  }

  dispatch({ type: types.GET_ORGANIZATION_BRANDING_START })
  try {
    const data = await getOrganizationBrandingByDomain(rawDomain)
    if (data.success) {
      const payload = {
        domain: normalizeDomain(rawDomain) || rawDomain,
        logo: data.logo ?? null,
        banner: data.banner ?? null
      }
      dispatch({
        type: types.GET_ORGANIZATION_BRANDING_SUCCESS,
        payload
      })
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(ORGANIZATION_BRANDING_STORAGE_KEY, JSON.stringify(payload))
        }
      } catch (_) {
        // ignore storage errors
      }
    } else {
      dispatch({
        type: types.GET_ORGANIZATION_BRANDING_ERROR,
        payload: { message: data.message || 'Failed to load organization branding' }
      })
    }
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to load organization branding'
    dispatch({
      type: types.GET_ORGANIZATION_BRANDING_ERROR,
      payload: { message }
    })
  }
}

export const clearOrganizationBranding = () => ({
  type: types.CLEAR_ORGANIZATION_BRANDING
})
