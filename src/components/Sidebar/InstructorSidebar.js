import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom/cjs/react-router-dom'
import LeadLogo from '../../assets/images/academy-icons/Group.png'
import MasterLogo from '../../assets/images/academy-icons/Icon.Master Classes.png'
import FolderSidebarImage from '../../assets/images/academy-icons/dashboard.png'
import ExpandLogo from '../../assets/images/academy-icons/fast-arrow-right.png'
import EntLogo from '../../assets/images/academy-icons/icon.png'
import LocationLogo from '../../assets/images/academy-icons/location.png'
import PortfolioLogo from '../../assets/images/academy-icons/portfolio.png'
import ProfilePhoto from '../../assets/images/academy-icons/profile.jpeg'
import SettingsLogo from '../../assets/images/academy-icons/settings 4.png'
import { setAccordionToggled } from '../../redux'
import SidebarItem from './SidebarItem'

const InstructorSidebar = (props) => {
  const [isTextVisible, setIsTextVisible] = useState(true)
  const dispatch = useDispatch()

  const truncateEmail = (email) => {
    if (email.length > 15) {
      return email.slice(0, 15) + '...'
    }
    return email
  }

  const setIsCollapsed = props.setIsCollapsed
  const isCollapsed = props.isCollapsed

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextVisible(!isCollapsed)
    }, 250)

    return () => clearTimeout(timer)
  }, [isCollapsed])

  const handleSidebarToggle = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <div class='d-flex flex-column justify-content-between h-93'>
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        id='side-menu-main'
      >
        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/dashboard'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={FolderSidebarImage}
          title={isTextVisible && !isCollapsed && 'Dashboard'}
          isDropdown={false}
        />

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/my-course-in-entrepreneurship'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={LocationLogo}
          title={isTextVisible && !isCollapsed && 'Intro to course'}
          isDropdown={false}
        />

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/dashboard'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={EntLogo}
          title={isTextVisible && !isCollapsed && 'Course in enterpreneurship'}
          isDropdown={false}
        />

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/beyond-your-course'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={MasterLogo}
          title={isTextVisible && !isCollapsed && 'Master classes'}
          isDropdown={false}
        />

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/dashboard'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={LeadLogo}
          title={isTextVisible && !isCollapsed && 'Leadership journal'}
          isDropdown={false}
        />

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/dashboard'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={PortfolioLogo}
          title={isTextVisible && !isCollapsed && 'My portfolio'}
          isDropdown={false}
        />
      </ul>
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        style={{ marginBottom: '-10px' }}
      >
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

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/dashboard'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={SettingsLogo}
          title={isTextVisible && !isCollapsed && 'My account'}
          isDropdown={false}
        />

        <li className='sub-li'>
          <Link to='dashboard'>
            <div className='d-flex w-100' style={{ alignItems: 'center' }}>
              <Col md='2' className='col-2 icon_container'>
                <img className='profile-photo' src={ProfilePhoto} alt='Icon' />
              </Col>
              {isTextVisible && !isCollapsed && (
                <div className='flex-grow-1 ms-1 d-flex flex-column'>
                  <span className='font-profile'>Kenia Anders</span>
                  <span className='font-profile email-profile'>
                    {truncateEmail('keniaanders@gmail.com')}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default InstructorSidebar
