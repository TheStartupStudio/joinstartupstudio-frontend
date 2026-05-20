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

const getBaseURL = () => {
  if (isProductionSubdomainHost()) {
    const subdomain = getSubdomain()
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      const segment = getApiPathSegment(subdomain)
      return `https://api.joinstartupstudio.com/${segment}/`
    }
  }
  return normalizeEnvServerBaseUrl(process.env.REACT_APP_SERVER_BASE_URL)
}

export default getBaseURL
