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

const getBaseURL = () => {
  if (isProductionSubdomainHost()) {
    const subdomain = getSubdomain()
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      const segment = getApiPathSegment(subdomain)
      return `https://api.joinstartupstudio.com/${segment}/`
    }
  }
  return process.env.REACT_APP_SERVER_BASE_URL
}

export default getBaseURL
