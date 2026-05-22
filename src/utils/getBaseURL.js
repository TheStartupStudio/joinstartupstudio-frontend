const getSubdomain = () => {
  const hostname = window.location.hostname
  return hostname.split('.')[0]
}

const isProductionSubdomainHost = () => {
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  if (parts.length < 3 || parts[0] === 'api') return false
  return (
    hostname.includes('joinstartupstudio.com') ||
    hostname.includes('joinstudioos.com')
  )
}

const getApiPathSegment = (subdomain) => {
  if (subdomain === 'studio') return 'academy'
  return subdomain
}

/**
 * Env-only API roots must be absolute (https://host/...). Values like
 * "dev-api.example.com" are treated as paths on the current site, producing
 * https://current-frontend/dev-api.example.com/...
 */
const normalizeEnvServerBaseUrl = (raw) => {
  if (raw == null || typeof raw !== 'string') return raw
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`
  return withScheme.endsWith('/') ? withScheme : `${withScheme}/`
}

const ACADEMY_API_SEGMENT = 'academy'
const PRODUCTION_API_ORIGIN = 'https://api.joinstartupstudio.com'

/** Shared admin routes (e.g. clients-config) live under /academy/ for all tenants. */
export const getAcademyApiBaseUrl = () => {
  if (isProductionSubdomainHost()) {
    return `${PRODUCTION_API_ORIGIN}/${ACADEMY_API_SEGMENT}/`
  }
  return normalizeEnvServerBaseUrl(process.env.REACT_APP_SERVER_BASE_URL)
}

export const getClientsConfigUrl = () => {
  const base = getAcademyApiBaseUrl()
  return base.endsWith('/') ? `${base}clients-config` : `${base}/clients-config`
}

const getBaseURL = () => {
  if (isProductionSubdomainHost()) {
    const subdomain = getSubdomain()
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      const segment = getApiPathSegment(subdomain)
      return `${PRODUCTION_API_ORIGIN}/${segment}/`
    }
  }
  return normalizeEnvServerBaseUrl(process.env.REACT_APP_SERVER_BASE_URL)
}

export default getBaseURL
