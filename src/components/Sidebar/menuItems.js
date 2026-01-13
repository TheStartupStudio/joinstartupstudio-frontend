// ...existing imports...

export const allMenuItems = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: DashIcon,
    hoverIcon: DashHoverICon,
    matchPath: 'dashboard',
    roles: {
      student: ['all']
    }
  },
  {
    title: 'Admin Dashboard',
    to: '/admin-dashboard',
    icon: DashIcon,
    hoverIcon: DashHoverICon,
    matchPath: 'admin-dashboard',
    roles: {
      admin: ['all'],
      instructor: ['all']
    }
  },
  {
    title: 'User Management',
    to: '/user-managment',
    icon: ManagementIcon,
    hoverIcon: ManagementIcon,
    matchPath: 'user-managment',
    roles: {
      admin: ['all'],
      instructor: ['all']
    }
  },
  {
    title: 'Content Management',
    to: '/content-management',
    icon: WorkspaceIcon,
    hoverIcon: WorkspaceHoverIcon,
    matchPath: 'content-management',
    roles: {
      admin: ['all']
    }
  },
  {
    title: 'Master Class Management',
    to: '/master-class-management',
    icon: LibraryIcon,
    hoverIcon: LibraryHoverIcon,
    matchPath: 'master-class-management',
    roles: {
      admin: ['all']
    },
    requiresUniversitySetting: 'hasMasterClasses'
  },
  {
    title: 'Leadership Journal Management',
    to: '/leadership-journal-management',
    icon: LibraryIcon,
    hoverIcon: LibraryHoverIcon,
    matchPath: 'leadership-journal-management',
    roles: {
      admin: ['all']
    },
    requiresUniversitySetting: 'hasLeadershipJournal'
  },
  {
    title: 'Leadership Journal',
    to: '/leadership-journal',
    icon: LibraryIcon,
    hoverIcon: LibraryHoverIcon,
    matchPath: 'leadership-journal',
    roles: {
      admin: ['all'],
      instructor: ['all'],
      student: ['all']
    },
    requiresUniversitySetting: 'hasLeadershipJournal'
  },
  {
    title: 'Studio Guidance',
    to: '/beyond-your-course',
    icon: LibraryIcon,
    hoverIcon: LibraryHoverIcon,
    matchPath: 'beyond-your-course',
    roles: {
      admin: ['all'],
      instructor: ['all'],
      student: ['all']
    },
    requiresUniversitySetting: 'hasMasterClasses'
  },
  // ...rest of menu items
]

export const getMenuItemsByRoleAndLevel = (role, level, university) => {
  return allMenuItems.filter((item) => {
    const allowedLevels = item.roles?.[role]
    if (!allowedLevels) return false
    
    // Check role permission
    const hasRolePermission = allowedLevels.includes('all') || allowedLevels.includes(level)
    if (!hasRolePermission) return false

    // Check university setting requirement
    if (item.requiresUniversitySetting) {
      const setting = university?.[item.requiresUniversitySetting]
      if (!setting) return false
    }

    return true
  })
}