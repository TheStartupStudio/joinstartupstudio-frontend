import React, { useEffect, useState, useRef } from 'react'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
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
    roles: [2, 1],
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
  // {
  //   id: 'leadership-journal',
  //   title: 'Leadership journal',
  //   srcImage: LeadershipIcon,
  //   to: '/leadership-journal',
  //   roles: [2, 1, 3],
  //   requiresUniversitySetting: 'hasLeadershipJournal',
  //   className: (pathname) => pathname.includes('leadership-journal') ? 'active' : ''
  // },
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
    id: 'tss-feeback',
    title: 'Website Feedback',
    srcImage: groupIcon,
    to: '/tss-feedback',
    roles: [3],
    className: (pathname) => pathname.includes('tss-feedback') ? 'active' : ''
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
  const location = useLocation()
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
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 22.25v-2.582l2.334 0.394a1.5 1.5 0 0 0 1.744 -1.353l0.287 -3.406c0.925 -0.207 1.59 -0.541 2.021 -0.821 0.387 -0.251 0.432 -0.755 0.174 -1.137L20.488 10.275c-0.246 -4.613 -4.064 -8.276 -8.738 -8.276v20.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0 -3 0ZM4 4.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0 -3 0Zm-0.5 15.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0 -3 0Z" stroke="black" strokeWidth="1.5"/>
            <path d="M4.5 12h7.25m0 -4H9l-2.25 -2.25m5 10.75h-3.25l-2.25 2.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      },
      {
        id: 'star',
        name: 'Star',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16.4 21h-2.154l-2 -5H5.754L3.755 21H1.6l6.4 -16h2zM21 12v9h-1.999V12zM6.555 14h4.892L9 7.885zm12.975 -11.68a0.508 0.508 0 0 1 0.941 0l0.253 0.61a4.373 4.373 0 0 0 2.25 2.327l0.717 0.32a0.529 0.529 0 0 1 0 0.962l-0.758 0.338a4.35 4.35 0 0 0 -2.22 2.25l-0.246 0.566a0.506 0.506 0 0 1 -0.934 0l-0.247 -0.565a4.35 4.35 0 0 0 -2.219 -2.251l-0.76 -0.338a0.53 0.53 0 0 1 0 -0.964l0.718 -0.32a4.373 4.373 0 0 0 2.25 -2.325z" fill="black"/>
            </svg>
      },
      {
        id: 'arrow',
        name: 'Arrow',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
          <path d="M4.688 21.094a0.792 0.792 0 0 1 -0.781 -0.781v-15.625a0.781 0.781 0 0 1 1.563 0v15.625a0.792 0.792 0 0 1 -0.781 0.781" fill="black"/>
          <path d="M20.313 21.094h-15.625a0.781 0.781 0 1 1 0 -1.563h15.625a0.781 0.781 0 0 1 0 1.563m-5.729 -5.729a0.771 0.771 0 0 1 -0.552 -0.229L11.458 12.563l-2.573 2.573a0.781 0.781 0 0 1 -1.104 -1.104l3.125 -3.125a0.781 0.781 0 0 1 1.104 0L14.583 13.479l3.615 -3.615a0.781 0.781 0 0 1 1.104 1.104l-4.167 4.167a0.771 0.771 0 0 1 -0.551 0.229" fill="black"/>
          <path d="M19.271 14.417a0.792 0.792 0 0 1 -0.781 -0.781v-2.958H15.625a0.781 0.781 0 1 1 0 -1.563h3.646a0.792 0.792 0 0 1 0.781 0.781v3.74a0.792 0.792 0 0 1 -0.781 0.781" fill="black"/>
        </svg>
      },
      {
        id: 'article',
        name: 'Article',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M22 3H2A2.075 2.075 0 0 0 0 5v14c0.04 1.091 0.91 1.96 24 0 -0.018 -14.524 -0.235 -15.023 -0.606 -15.394A2.078 2.078 0 0 0 22 3m0 16H2V5h20zm-8 -1.999V15.75c0 -1.66 -3.34 -2.5 -5 -2.5S4 14.09 4 15.75v1.25zM9 7A2.5 2.5 0 1 0 9 12a2.5 2.5 0 0 0 0 -5m5 0v1.001h6V7zm0 2v1h6V9zm0 2V12H18v-1z" fill="black"/>
          </svg>
      },
      {
        id: 'grid',
        name: 'Grid',
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 4H4A1.984 1.984 0 0 0 2.01 6.001l-0.01 12a1.993 1.993 0 0 0 2 1.999h16a1.993 1.993 0 0 0 2 -1.999V6a1.993 1.993 0 0 0 -2 -2m0 14H4v-6h16zm0 -10H4V6.001h16z" fill="black"/>
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

    // Add dynamic content items right after leadership-journal
    const dynamicItems = manageContentData.map(content => ({
      id: `journal-course-${content.id}`,
      title: content.title,
      srcImage: getIconSvg(content.icon),
      to: `/journal-courses/${content.id}`,
      roles: [1, 2, 3], // All roles can see these
      className: (pathname) => {
        // Check for journal-courses route
        if (pathname === `/journal-courses/${content.id}`) return 'active'
        // Check for leadership-journal route (defaults to ID 1)
        if (pathname === '/leadership-journal' && content.id === 1) return 'active'
        return ''
      },
      category: content.title // Add category for API calls
    }))

    // Find the leadership-journal item and insert dynamic items after it
    const result = []
    for (let i = 0; i < staticItems.length; i++) {
      result.push(staticItems[i])

      // If this is the leadership-journal item, insert dynamic items after it
      if (staticItems[i].id === 'forum') {
        result.push(...dynamicItems)
      }
    }

    return result
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

  useEffect(() => {
    const fetchManageContent = async () => {
      try {
        setManageContentLoading(true)
        const response = await axiosInstance.get('/journal-courses/manage-content/all')
        if (response.data.success) {
          setManageContentData(response.data.data || [])
        } else {
          console.error('Failed to fetch manage content data')
          setManageContentData([])
        }
      } catch (error) {
        console.error('Error fetching manage content data:', error)
        setManageContentData([])
      } finally {
        setManageContentLoading(false)
      }
    }

    fetchManageContent()
  }, [location.pathname])

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
