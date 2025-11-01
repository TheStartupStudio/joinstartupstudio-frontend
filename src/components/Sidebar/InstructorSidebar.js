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

const SIDEBAR_MENU_ITEMS = [
  // Role 3 for admin
  // Role 2 for instructor
  // Role 1 for student
  // 'all' for all roles
  {
    id: 'dashboard',
    title: 'Dashboard',
    srcImage: DashIcon,
    to: '/dashboard',
    roles: ['all'],
    className: (pathname) => pathname.includes('dashboard') && !pathname.includes('admin-dashboard') ? 'active' : ''
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    srcImage: AdminDashIcon,
    to: '/admin-dashboard',
    roles: [3],
    className: (pathname) => pathname.includes('admin-dashboard') ? 'active' : ''
  },
  {
    id: 'user-managment',
    title: 'User Managment',
    srcImage: groupIcon,
    to: '/user-managment',
    roles: [3],
    className: (pathname) => pathname.includes('user-managment') ? 'active' : ''
  },
    {
    id: 'content-management',
    title: 'Content Management',
    srcImage: groupIcon,
    to: '/content-management',
    roles: [3],
    className: (pathname) => pathname.includes('content-management') ? 'active' : ''
  },
  
  {
    id: 'master-class-management',
    title: 'Master Class Management',
    srcImage: groupIcon, // or use a different icon
    to: '/master-class-management',
    roles: [3],
    className: (pathname) => pathname.includes('master-class-management') ? 'active' : ''
  },

  {
    id: 'leadership-journal-management',
    title: 'Leadership Journal Management',
    srcImage: groupIcon, // or use a different icon
    to: '/leadership-journal-management',
    roles: [3],
    className: (pathname) => pathname.includes('leadership-journal-management') ? 'active' : ''
  },
  {
    id: 'intro-course',
    title: 'Intro to course',
    srcImage: IntroToIcon,
    to: '/my-course-in-entrepreneurship',
    roles: ['all'],
    className: (pathname) => pathname === '/my-course-in-entrepreneurship' ? 'active' : ''
  },
  {
    id: 'course-entrepreneurship',
    title: 'Course in enterpreneurship',
    srcImage: CoursEnIcon,
    to: '/my-course-in-entrepreneurship/journal',
    roles: ['all'],
    className: (pathname) => pathname.includes('my-course-in-entrepreneurship/journal') ? 'active' : ''
  },
  {
    id: 'master-classes',
    title: 'Master classes',
    srcImage: MasterIcon,
    to: '/beyond-your-course',
    roles: ['all'],
    className: (pathname) => pathname.includes('beyond-your-course') ? 'active' : ''
  },
  {
    id: 'leadership-journal',
    title: 'Leadership journal',
    srcImage: LeadershipIcon,
    to: '/leadership-journal',
    roles: ['all'],
    className: (pathname) => pathname.includes('leadership-journal') ? 'active' : ''
  },
  {
    id: 'my-portfolio',
    title: 'My portfolio',
    srcImage: PortfolioIcon,
    to: '/my-portfolio',
    roles: ['all'],
    className: (pathname) => pathname.includes('my-portfolio') ? 'active' : ''
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

  // Function to check if user has permission to see menu item
  const hasPermission = (itemRoles, userRoleId) => {
    if (itemRoles.includes('all')) return true
    return itemRoles.includes(userRoleId)
  }

  // Filter menu items based on user role
  const getVisibleMenuItems = () => {
    const userRoleId = user?.role_id || 1 // Default to student (1) if no role

    return SIDEBAR_MENU_ITEMS.filter(item => hasPermission(item.roles, userRoleId))
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
    await dispatch(userLogout())
      .then(() => {
        localStorage.clear()
        window.location.href = '/'
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => {
        window.location.href = '/'
        dispatch(setGeneralLoading(false))
      })
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
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
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

        <li className='sub-li'>
          <Link to='/dashboard'>
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

        <li className='sub-li' onClick={handleLogout}>
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
    </div>
  )
}

export default InstructorSidebar
