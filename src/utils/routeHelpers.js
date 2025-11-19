export const filterRoutesByAccess = (routes, user) => {
  if (!user?.user) return []

  const userRoleId = user.user.role_id
  const university = user.user.University

  return routes.filter(route => {
    // Check role requirement
    if (route.requiredRole && userRoleId !== route.requiredRole) {
      return false
    }

    // Check university setting requirement
    if (route.requiresUniversitySetting) {
      const setting = university?.[route.requiresUniversitySetting]
      if (!setting) return false
    }

    return true
  })
}

export const getDefaultDashboard = (userRoleId) => {
  // Instructor gets admin-dashboard, others get dashboard
  if (userRoleId === 2) {
    return '/admin-dashboard'
  }
  return '/dashboard'
}