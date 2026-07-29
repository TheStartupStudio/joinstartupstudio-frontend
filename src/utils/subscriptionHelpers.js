const SUBSCRIPTION_ACCESS_CACHE_KEY = 'subscription_access_granted'
const SUBSCRIPTION_ACCESS_USER_ID_KEY = 'subscription_access_user_id'
const ORGANIZATION_TYPE_CACHE_KEY = 'university_organization_type'

export const isSubscriptionExempt = (value) =>
  value === true || value === 'true' || value === 1 || value === '1'

export const SUBSCRIPTION_ACCESS_GRANTED_EVENT = 'subscription-access-granted'

export const grantSubscriptionAccess = (organizationType, userId) => {
  sessionStorage.setItem(SUBSCRIPTION_ACCESS_CACHE_KEY, '1')
  if (userId != null) {
    sessionStorage.setItem(SUBSCRIPTION_ACCESS_USER_ID_KEY, String(userId))
  }
  if (organizationType) {
    sessionStorage.setItem(ORGANIZATION_TYPE_CACHE_KEY, organizationType)
  }
  window.dispatchEvent(new Event(SUBSCRIPTION_ACCESS_GRANTED_EVENT))
}

export const clearSubscriptionAccessCache = () => {
  sessionStorage.removeItem(SUBSCRIPTION_ACCESS_CACHE_KEY)
  sessionStorage.removeItem(SUBSCRIPTION_ACCESS_USER_ID_KEY)
  sessionStorage.removeItem(ORGANIZATION_TYPE_CACHE_KEY)
}

export const hasCachedSubscriptionAccess = (userId) => {
  if (sessionStorage.getItem(SUBSCRIPTION_ACCESS_CACHE_KEY) !== '1') {
    return false
  }

  const cachedUserId = sessionStorage.getItem(SUBSCRIPTION_ACCESS_USER_ID_KEY)
  if (!cachedUserId || userId == null) {
    return false
  }

  return String(userId) === cachedUserId
}

const getCachedOrganizationType = () =>
  sessionStorage.getItem(ORGANIZATION_TYPE_CACHE_KEY)

export const isSubscriptionGatePath = (pathname) =>
  ['/subscribe', '/payment', '/cancel-payment'].includes(pathname)

export const getPostSubscriptionAccessPath = (user, pathname) => {
  if (pathname && !isSubscriptionGatePath(pathname) && pathname !== '/') {
    return pathname
  }

  const roleId = user?.role_id ?? user?.user?.role_id
  return roleId === 2 || roleId === 3 ? '/admin-dashboard' : '/dashboard'
}

export const isStandAloneOrganizationType = (organizationType) =>
  organizationType === 'stand-alone'

export const getUniversityFromUser = (user) => {
  const record = user?.user || user
  return record?.University || record?.university || null
}

export const getOrganizationType = (userOrSource) => {
  if (!userOrSource) return null

  if (typeof userOrSource === 'string') {
    return userOrSource
  }

  const university = getUniversityFromUser(userOrSource)
  return (
    userOrSource.organizationType ||
    userOrSource.organization_type ||
    userOrSource.universityType ||
    userOrSource.university_type ||
    university?.organizationType ||
    university?.organization_type ||
    university?.universityType ||
    university?.university_type ||
    null
  )
}

export const isStandAloneUniversity = (userOrSource) =>
  isStandAloneOrganizationType(getOrganizationType(userOrSource))

export const hasLifetimeAccess = (userState) => {
  const user = userState?.user || userState
  return isSubscriptionExempt(user?.lifetime_access)
}

export const hasSubscriptionAccess = (userState) => {
  const user = userState?.user || userState
  if (!user) return false

  if (hasCachedSubscriptionAccess(user.id)) return true

  const subscriptionExempt = user.subscription_exempt
  const subscriptionStatus = user.subscription_status
  const stripeSubscriptionId = user.stripe_subscription_id

  return (
    isSubscriptionExempt(subscriptionExempt) ||
    hasLifetimeAccess(user) ||
    isStandAloneUniversity(user) ||
    subscriptionStatus === 'active' ||
    (subscriptionStatus === 'canceling' && stripeSubscriptionId)
  )
}

export const shouldSkipSubscriptionFlow = (source) => {
  const organizationType = getOrganizationType(source)

  return (
    isSubscriptionExempt(source?.subscriptionExempt ?? source?.subscription_exempt) ||
    isSubscriptionExempt(source?.lifetimeAccess ?? source?.lifetime_access) ||
    isStandAloneOrganizationType(organizationType)
  )
}
