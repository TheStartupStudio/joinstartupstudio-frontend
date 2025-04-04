import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ExpandLogo from '../../assets/images/academy-icons/fast-arrow-right.png'
import LogOutIcon from '../../assets/images/academy-icons/svg/LogOut.svg'
import CoursEnIcon from '../../assets/images/academy-icons/svg/course-in-e.svg'
import DashIcon from '../../assets/images/academy-icons/svg/dashboard.svg'
import IntroToIcon from '../../assets/images/academy-icons/svg/intro-to-course.svg'
import LeadershipIcon from '../../assets/images/academy-icons/svg/leadership-journal.svg'
import MasterIcon from '../../assets/images/academy-icons/svg/master-classes.svg'
import PortfolioIcon from '../../assets/images/academy-icons/svg/my-portfolio.svg'
import SettingsIcon from '../../assets/images/academy-icons/svg/settings.svg'
import { setAccordionToggled, userLogout } from '../../redux'
import { setGeneralLoading } from '../../redux/general/Actions'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import SidebarItem from './SidebarItem'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'
import Tooltip from '../AcademyPortfolio/Tooltip'

const InstructorSidebar = (props) => {
  const [isTextVisible, setIsTextVisible] = useState(true)
  const dispatch = useDispatch()
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)
  const { user } = useSelector((state) => state.user.user)

  const truncateEmail = (email) => {
    if (email.length > 15) {
      return email.slice(0, 15) + '...'
    }
    return email
  }

  // const setIsCollapsed = props.setIsCollapsed
  // const isCollapsed = props.isCollapsed

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextVisible(!isCollapsed)
    }, 250)

    return () => clearTimeout(timer)
  }, [isCollapsed])

  const handleSidebarToggle = () => {
    dispatch(toggleCollapse())
  }

  const handleLogout = async () => {
    dispatch(setGeneralLoading(true))
    await dispatch(userLogout())
      .then(() => {
        localStorage.clear()
        // history.push('/')
        window.location.href = '/'
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => {
        window.location.href = '/login'
        dispatch(setGeneralLoading(false))
      })
  }

  return (
    <div
      class={`d-flex flex-column justify-content-between ${props.getOtherNavClass()}`}
    >
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        id='side-menu-main'
      >
        <Tooltip text={'Dashboard'}>
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/dashboard'}
            // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
            srcImage={DashIcon}
            title={isTextVisible && !isCollapsed && 'Dashboard'}
            isDropdown={false}
          />
        </Tooltip>

        <Tooltip text={'Intro to Course'}>
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/my-course-in-entrepreneurship'}
            // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
            srcImage={IntroToIcon}
            title={isTextVisible && !isCollapsed && 'Intro to course'}
            isDropdown={false}
          />
        </Tooltip>

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/my-course-in-entrepreneurship/journal/51'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={CoursEnIcon}
          title={isTextVisible && !isCollapsed && 'Course in enterpreneurship'}
          isDropdown={false}
        />

        <Tooltip text={'Master Classes'}>
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/beyond-your-course'}
            // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
            srcImage={MasterIcon}
            title={isTextVisible && !isCollapsed && 'Master classes'}
            isDropdown={false}
          />
        </Tooltip>

        <Tooltip text={'Leadership Journal'}>
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/leadership-journal'}
            // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
            srcImage={LeadershipIcon}
            title={isTextVisible && !isCollapsed && 'Leadership journal'}
            isDropdown={false}
          />
        </Tooltip>

        <Tooltip text={'My Portfolio'}>
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/my-portfolio'}
            // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
            srcImage={PortfolioIcon}
            title={isTextVisible && !isCollapsed && 'My portfolio'}
            isDropdown={false}
          />
        </Tooltip>
      </ul>
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        style={{ marginTop: '-20px' }}
      >
        <Tooltip text={`${isCollapsed ? 'Open Menu' : 'Close Menu'}`}>
          <li className='sub-li'>
            <button className='sidebar-button' onClick={handleSidebarToggle}>
              <img
                className='rotated'
                src={ExpandLogo}
                alt='Expand'
                style={{ transform: isCollapsed && 'rotate(0deg)' }}
              />
            </button>
          </li>
        </Tooltip>
        <Tooltip text={'My Account'}>
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/dashboard'}
            // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
            srcImage={SettingsIcon}
            title={isTextVisible && !isCollapsed && 'My account'}
            isDropdown={false}
          />
        </Tooltip>

        <li className='sub-li'>
          <Link to='dashboard'>
            <div className='d-flex w-100' style={{ alignItems: 'center' }}>
              <Col md='2' className='col-2 icon_container'>
                <img
                  className='profile-photo'
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
        <Tooltip text={'Log Out'}>
          <li className='sub-li' onClick={handleLogout}>
            <div className='logout-button'>
              <div className='d-flex w-100' style={{ alignItems: 'center' }}>
                <Col md='2' className='col-2 icon_container'>
                  <img
                    className='profile-photo'
                    src={LogOutIcon}
                    alt='Icon'
                    style={{ width: '26px' }}
                  />
                </Col>
                {isTextVisible && !isCollapsed && (
                  <div className='flex-grow-1 ms-1'>LOG OUT</div>
                )}
              </div>
            </div>
          </li>
        </Tooltip>
      </ul>
    </div>
  )
}

export default InstructorSidebar
