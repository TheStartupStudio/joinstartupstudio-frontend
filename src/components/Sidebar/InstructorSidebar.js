import React, { useEffect, useState, useRef } from 'react'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ExpandLogo from '../../assets/images/academy-icons/fast-arrow-right.png'
import LogOutIcon from '../../assets/images/academy-icons/svg/LogOut.svg'
import CoursEnIcon from '../../assets/images/academy-icons/svg/course-in-e.svg'
import DashIcon from '../../assets/images/academy-icons/svg/dashboard.svg'
import AdminDashIcon from '../../assets/images/academy-icons/svg/dashboard.svg' // You'll need to add this
import IntroToIcon from '../../assets/images/academy-icons/svg/intro-to-course.svg'
import MasterIcon from '../../assets/images/academy-icons/svg/master-classes.svg'
import LeadershipIcon from '../../assets/images/academy-icons/svg/leadership-journal.svg'
import ContentSiteIcon from '../../assets/images/academy-icons/svg/course-in-e.svg'
import PortfolioIcon from '../../assets/images/academy-icons/svg/my-portfolio.svg'
import SettingsIcon from '../../assets/images/academy-icons/svg/settings.svg'
import groupIcon from '../../assets/images/group.png'
import { setAccordionToggled, userLogout } from '../../redux'
import { setGeneralLoading } from '../../redux/general/Actions'
import { collapseTrue, toggleCollapse } from '../../redux/sidebar/Actions'
import SidebarItem from './SidebarItem'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'
// import Tooltip from '../AcademyPortfolio/Tooltip'
import CancelRenewalModal from '../UserDetails/CancelRenewalModal'
import CancelSubModal from '../UserDetails/CancelSubModal'
import CertificateModal from '../UserDetails/CertificateModal'
import EditUserModal from '../UserDetails/EditUserModal'
import SubscriptionModal from '../UserDetails//SubscriptionModal'
import InvoiceIcon from '../../assets/images/academy-icons/hand-card.png'
import ForumIcon from '../../assets/images/academy-icons/svg/material-symbols_forum-outline-rounded.svg'
import UserAgreementModal from '../UserAgreementModal'
import axiosInstance from '../../utils/AxiosInstance'

const SIDEBAR_MENU_ITEMS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    srcImage: DashIcon,
    to: '/dashboard',
    roles: [1], // Only students
    className: (pathname) => pathname === '/dashboard' ? 'active' : ''
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    srcImage: AdminDashIcon,
    to: '/admin-dashboard',
    roles: [3, 2], // Admin and Instructor
    className: (pathname) => pathname.includes('admin-dashboard') ? 'active' : ''
  },
  {
    id: 'user-managment',
    title: 'User Management',
    srcImage: groupIcon,
    to: '/user-managment',
    roles: [3, 2],
    className: (pathname) => pathname.includes('user-managment') ? 'active' : ''
  },
  {
    id: 'content-management',
    title: 'Course Management',
    srcImage: CoursEnIcon,
    to: '/content-management',
    roles: [3],
    className: (pathname) => pathname.includes('content-management') ? 'active' : ''
  },
  {
    id: 'master-class-management',
    title: 'Studio Guidance Management',
    srcImage: MasterIcon,
    to: '/master-class-management',
    roles: [3],
    requiresUniversitySetting: 'hasMasterClasses',
    className: (pathname) => pathname.includes('master-class-management') ? 'active' : ''
  },
  {
    id: 'leadership-journal-management',
    title: 'Leadership Journal Management',
    srcImage: LeadershipIcon,
    to: '/leadership-journal-management',
    roles: [3],
    requiresUniversitySetting: 'hasLeadershipJournal',
    className: (pathname) => pathname.includes('leadership-journal-management') ? 'active' : ''
  },
  {
    id: 'manage-content-site',
    title: 'Manage Content Site',
    srcImage: ContentSiteIcon,
    to: '/manage-content-site',
    roles: [3],
    className: (pathname) => pathname.includes('manage-content-site') ? 'active' : ''
  },
  {
    id: 'intro-course',
    title: 'Intro to the Studio',
    srcImage: IntroToIcon,
    to: '/my-course-in-entrepreneurship',
    roles: [2, 1],
    className: (pathname) => pathname === '/my-course-in-entrepreneurship' ? 'active' : ''
  },
  {
    id: 'course-entrepreneurship',
    title: 'Studio Sessions',
    srcImage: CoursEnIcon,
    to: '/my-course-in-entrepreneurship/journal',
    roles: [2, 1, 3],
    className: (pathname) => pathname.includes('my-course-in-entrepreneurship/journal') ? 'active' : ''
  },
  {
    id: 'master-classes',
    title: 'Studio Guidance',
    srcImage: MasterIcon,
    to: '/beyond-your-course',
    roles: [2, 1],
    requiresUniversitySetting: 'hasMasterClasses',
    className: (pathname) => pathname.includes('beyond-your-course') ? 'active' : ''
  },
  {
    id: 'leadership-journal',
    title: 'Leadership journal',
    srcImage: LeadershipIcon,
    to: '/leadership-journal',
    roles: [2, 1, 3],
    requiresUniversitySetting: 'hasLeadershipJournal',
    className: (pathname) => pathname.includes('leadership-journal') ? 'active' : ''
  },
  {
    id: 'forum',
    title: 'Studio Forum',
    srcImage: ForumIcon,
    to: '/startup-forum',
    roles: [3, 1],
    requiresUniversitySetting: 'hasForumAccess',
    className: (pathname) => pathname.includes('startup-forum') ? 'active' : ''
  },
  {
    id: 'my-portfolio',
    title: 'My portfolio',
    srcImage: PortfolioIcon,
    to: '/my-portfolio',
    roles: [2, 1],
    className: (pathname) => pathname.includes('my-portfolio') ? 'active' : ''
  },
  {
    id: 'view-invoices',
    title: 'View Invoices',
    srcImage: InvoiceIcon,
    to: '/view-invoices',
    roles: [3, 2],
    className: (pathname) => pathname.includes('view-invoices') ? 'active' : ''
  }
]

const InstructorSidebar = (props) => {
  const [isTextVisible, setIsTextVisible] = useState(true)
  const dispatch = useDispatch()
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)
  const { user } = useSelector((state) => state.user.user)
  const [modal, setModal] = useState(false)
  const [subsbsciptionModal, setSubscriptionModal] = useState(false)
  const [cancelSubModal, setCancelSubModal] = useState(false)
  const [canceledRenewal, setCanceledRenewal] = useState(false)
  const [certificate, setCertificate] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const hoverTimeout = useRef(null)
  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [hasCheckedAgreement, setHasCheckedAgreement] = useState(false)
  const [manageContentData, setManageContentData] = useState([])
  const [manageContentLoading, setManageContentLoading] = useState(false)

  const hasPermission = (itemRoles, userRoleId) => {
    if (itemRoles.includes('all')) return true
    return itemRoles.includes(userRoleId)
  }

  const getIconSvg = (iconName) => {
    const iconOptions = [
      {
        id: 'leader',
        name: 'Leader',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14.5 2H4.5C4.23478 2 3.98043 2.10536 3.79289 2.29289C3.60536 2.48043 3.5 2.73478 3.5 3V21C3.5 21.2652 3.60536 21.5196 3.79289 21.7071C3.98043 21.8946 4.23478 22 4.5 22H18.5C18.7652 22 19.0196 21.8946 19.2071 21.7071C19.3946 21.5196 19.5 21.2652 19.5 21V10.0025" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.5 9H10.5M6.5 14H12.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
          <path d="M20.5 3L14.5015 8.9975" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      },
      {
        id: 'book',
        name: 'Book/Document',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M21.3337 29.666V26.224L24.4457 26.7487C24.7184 26.7947 24.9977 26.7836 25.2659 26.7161C25.5342 26.6486 25.7855 26.5263 26.004 26.3567C26.2225 26.1872 26.4035 25.9742 26.5356 25.7311C26.6676 25.4881 26.7477 25.2203 26.771 24.9447L27.1537 20.4034C28.387 20.1267 29.2737 19.6807 29.849 19.3087C30.365 18.9753 30.425 18.302 30.081 17.7927L27.317 13.7013C26.989 7.55135 21.8983 2.66602 15.667 2.66602V29.666" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18C4.53043 18 5.03914 17.7893 5.41421 17.4142C5.78929 17.0391 6 16.5304 6 16C6 15.4696 5.78929 14.9609 5.41421 14.5858C5.03914 14.2107 4.53043 14 4 14C3.46957 14 2.96086 14.2107 2.58579 14.5858C2.21071 14.9609 2 15.4696 2 16ZM5.33333 6C5.33333 6.26264 5.38506 6.52272 5.48557 6.76537C5.58608 7.00802 5.7334 7.2285 5.91912 7.41421C6.10484 7.59993 6.32532 7.74725 6.56797 7.84776C6.81062 7.94827 7.07069 8 7.33333 8C7.59598 8 7.85605 7.94827 8.0987 7.84776C8.34135 7.74725 8.56183 7.59993 8.74755 7.41421C8.93326 7.2285 9.08058 7.00802 9.18109 6.76537C9.2816 6.52272 9.33333 6.26264 9.33333 6C9.33333 5.73736 9.2816 5.47728 9.18109 5.23463C9.08058 4.99198 8.93326 4.7715 8.74755 4.58579C8.56183 4.40007 8.34135 4.25275 8.0987 4.15224C7.85605 4.05173 7.59598 4 7.33333 4C7.07069 4 6.81062 4.05173 6.56797 4.15224C6.32532 4.25275 6.10484 4.40007 5.91912 4.58579C5.7334 4.7715 5.58608 4.99198 5.48557 5.23463C5.38506 5.47728 5.33333 5.73736 5.33333 6ZM4.66667 26.6667C4.66667 27.1971 4.87738 27.7058 5.25245 28.0809C5.62753 28.456 6.13623 28.6667 6.66667 28.6667C7.1971 28.6667 7.70581 28.456 8.08088 28.0809C8.45595 27.7058 8.66667 27.1971 8.66667 26.6667C8.66667 26.1362 8.45595 25.6275 8.08088 25.2525C7.70581 24.8774 7.1971 24.6667 6.66667 24.6667C6.13623 24.6667 5.62753 24.8774 5.25245 25.2525C4.87738 25.6275 4.66667 26.1362 4.66667 26.6667Z" stroke="black" strokeWidth="2"/>
          <path d="M6 15.9993H15.6667M15.6667 10.666H12L9 7.66602M15.6667 21.9993H11.3333L8.33333 24.9993" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      },
      {
        id: 'star',
        name: 'Star',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M21.8671 28.0005H18.9951L16.3285 21.3338H7.67246L5.00579 28.0005H2.13379L10.6671 6.66712H13.3338L21.8671 28.0005ZM28.0005 16.0005V28.0005H25.3338V16.0005H28.0005ZM8.73912 18.6671H15.2618L12.0005 10.5138L8.73912 18.6671ZM26.0391 3.09378C26.0892 2.96812 26.1758 2.86037 26.2877 2.78446C26.3997 2.70855 26.5319 2.66797 26.6671 2.66797C26.8024 2.66797 26.9345 2.70855 27.0465 2.78446C27.1585 2.86037 27.2451 2.96812 27.2951 3.09378L27.6325 3.90712C28.1984 5.28722 29.2722 6.3977 30.6325 7.00978L31.5885 7.43645C31.7109 7.49309 31.8145 7.58357 31.8871 7.69722C31.9598 7.81086 31.9984 7.94291 31.9984 8.07779C31.9984 8.21266 31.9598 8.34471 31.8871 8.45835C31.8145 8.572 31.7109 8.66248 31.5885 8.71912L30.5778 9.16978C29.2506 9.76435 28.1945 10.8347 27.6178 12.1698L27.2898 12.9245C27.2385 13.0473 27.1521 13.1523 27.0413 13.2261C26.9304 13.3 26.8003 13.3394 26.6671 13.3394C26.534 13.3394 26.4038 13.3 26.293 13.2261C26.1822 13.1523 26.0957 13.0473 26.0445 12.9245L25.7151 12.1711C25.139 10.8358 24.0834 9.76494 22.7565 9.16978L21.7431 8.71912C21.6203 8.66264 21.5163 8.57214 21.4434 8.45836C21.3705 8.34457 21.3318 8.21226 21.3318 8.07712C21.3318 7.94198 21.3705 7.80967 21.4434 7.69588C21.5163 7.58209 21.6203 7.49159 21.7431 7.43512L22.7005 7.00845C24.0607 6.39728 25.1349 5.28779 25.7018 3.90845L26.0391 3.09378Z" fill="black"/>
        </svg>
      },
      {
        id: 'arrow',
        name: 'Arrow',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M6 27C5.73586 26.9965 5.4835 26.8901 5.29671 26.7033C5.10992 26.5165 5.00345 26.2641 5 26V6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5C6.26522 5 6.51957 5.10536 6.70711 5.29289C6.89464 5.48043 7 5.73478 7 6V26C6.99655 26.2641 6.89008 26.5165 6.70329 26.7033C6.5165 26.8901 6.26414 26.9965 6 27Z" fill="black"/>
          <path d="M26 26.9991H6C5.73478 26.9991 5.48043 26.8938 5.29289 26.7063C5.10536 26.5187 5 26.2644 5 25.9991C5 25.7339 5.10536 25.4796 5.29289 25.292C5.48043 25.1045 5.73478 24.9991 6 24.9991H26C26.2652 24.9991 26.5196 25.1045 26.7071 25.292C26.8946 25.4796 27 25.7339 27 25.9991C27 26.2644 26.8946 26.5187 26.7071 26.7063C26.5196 26.8938 26.2652 26.9991 26 26.9991ZM18.6667 19.6658C18.5353 19.6664 18.4051 19.6408 18.2837 19.5904C18.1624 19.5401 18.0523 19.466 17.96 19.3725L14.6667 16.0791L11.3733 19.3725C11.1838 19.5491 10.933 19.6453 10.674 19.6407C10.4149 19.6361 10.1677 19.5312 9.9845 19.348C9.80129 19.1648 9.69634 18.9176 9.69177 18.6585C9.6872 18.3994 9.78336 18.1487 9.96 17.9591L13.96 13.9591C14.1475 13.7719 14.4017 13.6667 14.6667 13.6667C14.9317 13.6667 15.1858 13.7719 15.3733 13.9591L18.6667 17.2525L23.2933 12.6258C23.4829 12.4492 23.7336 12.353 23.9927 12.3576C24.2518 12.3621 24.4989 12.4671 24.6822 12.6503C24.8654 12.8335 24.9703 13.0807 24.9749 13.3398C24.9795 13.5989 24.8833 13.8496 24.7067 14.0391L19.3733 19.3725C19.281 19.466 19.1709 19.5401 19.0496 19.5904C18.9282 19.6408 18.7981 19.6664 18.6667 19.6658Z" fill="black"/>
          <path d="M24.6667 18.4527C24.4025 18.4492 24.1502 18.3428 23.9634 18.156C23.7766 17.9692 23.6701 17.7168 23.6667 17.4527V13.666H20C19.7348 13.666 19.4804 13.5607 19.2929 13.3731C19.1054 13.1856 19 12.9312 19 12.666C19 12.4008 19.1054 12.1464 19.2929 11.9589C19.4804 11.7714 19.7348 11.666 20 11.666H24.6667C24.9308 11.6695 25.1832 11.7759 25.37 11.9627C25.5567 12.1495 25.6632 12.4019 25.6667 12.666V17.4527C25.6632 17.7168 25.5567 17.9692 25.37 18.156C25.1832 18.3428 24.9308 18.4492 24.6667 18.4527Z" fill="black"/>
        </svg>
      },
      {
        id: 'article',
        name: 'Article',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M29.3333 4H2.66667C1.21333 4.05333 0.0533333 5.21333 0 6.66667V25.3333C0.0533333 26.7867 1.21333 27.9467 32 25.3333C31.9755 5.96724 31.6866 5.30312 31.1918 4.80825C30.6969 4.31337 30.0328 4.02454 29.3333 4ZM29.3333 25.3333H2.66667V6.66667H29.3333V25.3333ZM18.6667 22.6667V21C18.6667 18.7867 14.2133 17.6667 12 17.6667C9.78667 17.6667 5.33333 18.7867 5.33333 21V22.6667H18.6667ZM12 9.33333C11.1159 9.33333 10.2681 9.68452 9.64298 10.3096C9.01786 10.9348 8.66667 11.7826 8.66667 12.6667C8.66667 13.1044 8.75289 13.5379 8.9204 13.9423C9.08792 14.3467 9.33345 14.7142 9.64298 15.0237C10.2681 15.6488 11.1159 16 12 16C12.4377 16 12.8712 15.9138 13.2756 15.7463C13.68 15.5787 14.0475 15.3332 14.357 15.0237C14.6666 14.7142 14.9121 14.3467 15.0796 13.9423C15.2471 13.5379 15.3333 13.1044 15.3333 12.6667C15.3333 12.2289 15.2471 11.7955 15.0796 11.3911C14.9121 10.9866 14.6666 10.6192 14.357 10.3096C14.0475 10.0001 13.68 9.75458 13.2756 9.58707C12.8712 9.41955 12.4377 9.33333 12 9.33333ZM18.6667 9.33333V10.6667H26.6667V9.33333H18.6667ZM18.6667 12V13.3333H26.6667V12H18.6667ZM18.6667 14.6667V16H24V14.6667H18.6667Z" fill="black"/>
        </svg>
      },
      {
        id: 'grid',
        name: 'Grid',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M26.667 5.33398H5.33366C3.85366 5.33398 2.68033 6.52065 2.68033 8.00065L2.66699 24.0007C2.66699 25.4807 3.85366 26.6673 5.33366 26.6673H26.667C28.147 26.6673 29.3337 25.4807 29.3337 24.0007V8.00065C29.3337 6.52065 28.147 5.33398 26.667 5.33398ZM26.667 24.0007H5.33366V16.0007H26.667V24.0007ZM26.667 10.6673H5.33366V8.00065H26.667V10.6673Z" fill="black"/>
        </svg>
      }
    ]

    const foundIcon = iconOptions.find(option => option.id === iconName)
    return foundIcon ? foundIcon.svg : iconOptions[0].svg // Default to leader icon if not found
  }

  const getVisibleMenuItems = () => {
    const userRoleId = user?.role_id || 1
    const university = user?.University

    const staticItems = SIDEBAR_MENU_ITEMS.filter(item => {
      // Check role permission
      if (!hasPermission(item.roles, userRoleId)) return false

      if (item.requiresUniversitySetting) {
        const setting = university?.[item.requiresUniversitySetting]
        if (!setting) return false
      }

      return true
    })

    // Add dynamic content items
    const dynamicItems = manageContentData.map(content => ({
      id: `journal-course-${content.id}`,
      title: content.title,
      srcImage: getIconSvg(content.icon),
      to: `/journal-courses/${content.id}`,
      roles: [1, 2, 3], // All roles can see these
      className: (pathname) => pathname === `/journal-courses/${content.id}` ? 'active' : '',
      category: content.title // Add category for API calls
    }))

    return [...staticItems, ...dynamicItems]
  }

  const toggle = () => setModal((prev) => !prev)

  const subToggle = () => {
    setModal((prev) => !prev)
    setSubscriptionModal((prev) => !prev)
  }

  const toggleCancelModal = () => {
    setCancelSubModal((prev) => !prev)
    setSubscriptionModal((prev) => !prev)
  }

  const toggleCancelRenewal = () => {
    setCancelSubModal((prev) => !prev)
    setCanceledRenewal((prev) => !prev)
  }

  const truncateEmail = (email) => {
    if (email.length > 15) {
      return email.slice(0, 15) + '...'
    }
    return email
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextVisible(!isCollapsed)
    }, 250)

    return () => clearTimeout(timer)
  }, [isCollapsed])

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      )
    }
    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  useEffect(() => {
    if (user) {
      setHasCheckedAgreement(true)
    }
  }, [user])

  // useEffect(() => {
  //   const fetchManageContent = async () => {
  //     try {
  //       setManageContentLoading(true)
  //       const response = await axiosInstance.get('/journal-courses/manage-content/all')
  //       if (response.data.success) {
  //         setManageContentData(response.data.data || [])
  //       } else {
  //         console.error('Failed to fetch manage content data')
  //         setManageContentData([])
  //       }
  //     } catch (error) {
  //       console.error('Error fetching manage content data:', error)
  //       setManageContentData([])
  //     } finally {
  //       setManageContentLoading(false)
  //     }
  //   }

  //   fetchManageContent()
  // }, [])

  const handleMouseEnter = () => {
    if (isTouchDevice) return
    clearTimeout(hoverTimeout.current)
    if (isCollapsed) {
      dispatch(toggleCollapse(false))
    }
  }

  const handleMouseLeave = () => {
    if (isTouchDevice) return
    clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => {
      if (!isCollapsed) {
        dispatch(toggleCollapse(true))
      }
    }, 100)
  }

  const handleSidebarToggle = () => {
    dispatch(toggleCollapse())
  }

  const handleLogout = async () => {
    dispatch(setGeneralLoading(true))
    try {
      await dispatch(userLogout())
      localStorage.clear()
      dispatch(setGeneralLoading(false))
    } catch (error) {
      console.log('error', error)
      dispatch(setGeneralLoading(false))
    }
  }

  const handleAgreementSuccess = () => {
    setShowAgreementModal(false)
  }

  const handleAgreementHide = () => {
    const university = user?.University
    const hasForumAccess = university?.hasForumAccess
    const forumAgreement = user?.forumAgreement
    
    if (hasForumAccess && !forumAgreement) {
      return
    }
    setShowAgreementModal(false)
  }

  const handleMenuItemClick = (item) => {
    if (item.id === 'forum') {
      const isSubscribed = user?.stripe_subscription_id || user?.subscription_exempt

      if (!isSubscribed) {
        dispatch(setAccordionToggled(false))
        props.props.hideHeaderIcons()
        return true // Allow navigation
      }

      const forumAgreement = user?.forumAgreement

      if (!forumAgreement) {
        setShowAgreementModal(true)
        return false 
      }
    }

    dispatch(setAccordionToggled(false))
    props.props.hideHeaderIcons()
    return true 
  }

  const navHeight = props.navHeight

  return (
    <div
      className={`d-flex flex-column justify-content-between ${props.getOtherNavClass()}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        id='side-menu-main'
      >
        {getVisibleMenuItems().map((item) => (
          <SidebarItem
            key={item.id}
            onClick={() => handleMenuItemClick(item)}
            to={item.to}
            className={typeof item.className === 'function' ? item.className(location.pathname) : item.className}
            srcImage={item.srcImage}
            title={isTextVisible && !isCollapsed && item.title}
            isDropdown={false}
          />
        ))}
      </ul>
      
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        style={{ marginTop: '-20px' }}
      >
        <li
          className='sub-li'
          onClick={() => {
            dispatch(setAccordionToggled(false))
            dispatch(collapseTrue())
            props.props.hideHeaderIcons()
            toggle()
          }}
        >
          <div className='logout-button'>
            <div className='d-flex w-100' style={{ alignItems: 'center' }}>
              <Col md='2' className='col-2 icon_container'>
                <img
                  src={SettingsIcon}
                  alt='Icon'
                  style={{
                    width: '26px',
                    marginLeft: '3px',
                    objectFit: 'cover'
                  }}
                />
              </Col>
              {isTextVisible && !isCollapsed && (
                <div className='flex-grow-1 ms-1 mb-1'>MY ACCOUNT</div>
              )}
            </div>
          </div>
        </li>

        <li className='sub-li'
          onClick={() => {
            dispatch(setAccordionToggled(false))
            dispatch(collapseTrue())
            props.props.hideHeaderIcons()
            toggle()
          }}
        >

          <Link to={user?.role_id === 1 ? '/dashboard' : '/admin-dashboard'}>
            <div className='d-flex w-100' style={{ alignItems: 'center' }}>
              <Col md='2' className='col-2 icon_container'>
                <img
                  className='profile-photo'
                  style={{ marginLeft: '-3.5px' }}
                  src={user.profileImage ? user.profileImage : blankProfile}
                  alt='Icon'
                />
              </Col>
              {isTextVisible && !isCollapsed && (
                <div className='flex-grow-1 ms-1 d-flex flex-column'>
                  <span className='font-profile'>{user?.name}</span>
                  <span className='font-profile email-profile'>
                    {truncateEmail(user?.email)}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </li>

        <li className='sub-li sub-li-logout-button' onClick={handleLogout}>
          <div className='logout-button'>
            <div className='d-flex w-100' style={{ alignItems: 'center' }}>
              <Col md='2' className='col-2 icon_container'>
                <img
                  src={LogOutIcon}
                  alt='Icon'
                  style={{ width: '26px', marginLeft: '3px' }}
                />
              </Col>
              {isTextVisible && !isCollapsed && (
                <div className='flex-grow-1 ms-1 mb-1'>LOG OUT</div>
              )}
            </div>
          </div>
        </li>
      </ul>

      <EditUserModal isOpen={modal} toggle={toggle} subToggle={subToggle} />
      <SubscriptionModal
        subsbsciptionModal={subsbsciptionModal}
        setSubscriptionModal={setSubscriptionModal}
        toggleCancelModal={toggleCancelModal}
      />
      <CancelSubModal
        cancelSubModal={cancelSubModal}
        setCancelSubModal={setCancelSubModal}
        toggleCancelModal={toggleCancelModal}
        toggleCancelRenewal={toggleCancelRenewal}
      />
      <CancelRenewalModal
        canceledRenewal={canceledRenewal}
        setCanceledRenewal={setCanceledRenewal}
      />
      <UserAgreementModal
        show={showAgreementModal}
        onSuccess={handleAgreementSuccess}
        onHide={handleAgreementHide}
      />
    </div>
  )
}

export default InstructorSidebar
