import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import rootReducer from './rootReducer'

const ORGANIZATION_BRANDING_STORAGE_KEY = 'organizationBranding'

function normalizeDomain (domain) {
  const d = (domain || '').toString().trim().toLowerCase()
  return d.replace(/^www\./, '')
}

function getOrganizationBrandingPreload () {
  try {
    if (typeof window === 'undefined') return undefined
    const raw = window.localStorage.getItem(ORGANIZATION_BRANDING_STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    const currentDomain = normalizeDomain(window.location.hostname)
    const cachedDomain = normalizeDomain(parsed?.domain)
    if (parsed && cachedDomain && cachedDomain === currentDomain) {
      return {
        organizationBranding: {
          domain: parsed.domain,
          logo: parsed.logo ?? null,
          banner: parsed.banner ?? null,
          loading: false,
          error: null
        }
      }
    }
  } catch (_) {}
  return undefined
}

const middlewares = [thunk]
const preloadedState = getOrganizationBrandingPreload()

const store = createStore(
  rootReducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(...middlewares))
)

export default store
