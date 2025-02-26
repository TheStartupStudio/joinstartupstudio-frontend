import React from 'react'
import { Link } from 'react-router-dom'
import FolderSidebarImage from '../../assets/images/academy-icons/dashboard.png'
import LtsEduImage from '../../assets/images/HS-Sidebar-Icons/lts-edu-sidebar.svg'
import ClassroomImage from '../../assets/images/HS-Sidebar-Icons/classroom-sidebar.svg'
import MarketImage from '../../assets/images/HS-Sidebar-Icons/market-sidebar.svg'
import JournalImage from '../../assets/images/HS-Sidebar-Icons/journal-sidebar.svg'
import SidebarItem from './SidebarItem'
import ParentSidebarItem from './ParentSidebarItem'
import ParentDropdownItem from './ParentDropdownItem'
import DropdownItem from './DropdownItem'
import { useDispatch, useSelector } from 'react-redux'
import { setAccordionToggled } from '../../redux'
import { useLocation } from 'react-router-dom/cjs/react-router-dom'
import Group3888Image from '../../assets/images/HS-Sidebar-Icons/Group 3888/Group 3888@2x.png'
import LocationLogo from '../../assets/images/academy-icons/location.png'
import EntLogo from '../../assets/images/academy-icons/icon.png'
import MasterLogo from '../../assets/images/academy-icons/Icon.Master Classes.png'
import PortfolioLogo from '../../assets/images/academy-icons/portfolio.png'
import LeadLogo from '../../assets/images/academy-icons/Group.png'
import ExpandLogo from '../../assets/images/academy-icons/fast-arrow-right.png'
import SettingsLogo from '../../assets/images/academy-icons/settings 4.png'
import ProfilePhoto from '../../assets/images/academy-icons/profile.jpeg'
import { Col } from 'react-bootstrap'

const InstructorSidebar = (props) => {
  const { isAdmin } = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const location = useLocation()

  const truncateEmail = (email) => {
    if (email.length > 15) {
      return email.slice(0, 15) + '...'
    }
    return email
  }

  return (
    <div class='d-flex flex-column justify-content-between h-100'>
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
          title='Dashboard'
          isDropdown={false}
        />

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/dashboard'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={LocationLogo}
          title='Intro to course'
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
          title='Course in enterpreneurship'
          isDropdown={false}
        />

        <SidebarItem
          onClick={() => {
            dispatch(setAccordionToggled(false))
            props.props.hideHeaderIcons()
          }}
          to={'/dashboard'}
          // className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
          srcImage={MasterLogo}
          title='Master classes'
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
          title='My portfolio'
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
          title='Leadership journal'
          isDropdown={false}
        />

        {/* {isAdmin && (
        <>
          <ParentSidebarItem
            ariaControls='myUserManagament'
            href='#myUserManagament'
            srcImage={FolderSidebarImage}
            title='My User Managament'
            isDropdown={true}
          />
          <ParentDropdownItem id={'myUserManagament'}>
            <DropdownItem title={'MY SCHOOL'} to={'/my-school'} />
            <DropdownItem title={'MY IMMERSION'} to={'/my-immersion-admin'} />
            <DropdownItem
              // disabled={true}
              title={'My courses & management'}
              to={'/my-courses-management'}
            />
          </ParentDropdownItem>
        </>
      )} */}
        {/* <ParentSidebarItem
        href='#myLtsEDU'
        aria-controls='myLtsEDU'
        srcImage={LtsEduImage}
        title='MY Learn to Start EDU'
        isDropdown={true}
      />
      <ParentDropdownItem id={'myLtsEDU'}>
        <DropdownItem title={'My training'} to={'/my-training'} />
        <DropdownItem title={'My curriculum'} to={'/my-curriculum'} />
        <DropdownItem
          title={'My certification guide'}
          to={'/my-certification-guide'}
        />
        <DropdownItem
          title={' My performance data'}
          to={'/my-performance-data'}
        />
      </ParentDropdownItem>
      <ParentSidebarItem
        ariaControls='collapseClassroom'
        href='#collapseClassroom'
        srcImage={ClassroomImage}
        title='MY CLASSROOM'
        isDropdown={true}
      />
      <ParentDropdownItem id={'collapseClassroom'}>
        <DropdownItem title={'MY STUDENTS'} to={'/my-students'} />
        <DropdownItem
          // disabled={true}
          title={'MY EVALUATIONS'}
          to={'/my-evaluation'}
        />
        <DropdownItem title={'MY INBOX'} to='/my-inbox' />
      </ParentDropdownItem>

      <ParentSidebarItem
        ariaControls='collapseExample'
        href='#collapseExample'
        srcImage={MarketImage}
        title='MY MARKET RESOURCES'
        isDropdown={true}
      />
      <ParentDropdownItem id={'collapseExample'}>
        <DropdownItem title={'MY PATHWAYS'} to={'/pathways'} />
        <DropdownItem title={'MY IMMERSION'} to={'/my-immersion'} />
        <DropdownItem
          title={'MY COURSE & CREDENTIALS'}
          to='/my-course-credentials'
        />
       
      </ParentDropdownItem>
      <ParentSidebarItem
        ariaControls='journals'
        href='#journals'
        srcImage={JournalImage}
        title='JOURNALS'
        isDropdown={true}
      />
      <ParentDropdownItem id={'journals'}>
        <DropdownItem title={'MY LTS JOURNAL'} to={'/lts-journal'} />
        <DropdownItem title={'MY MENTORSHIP JOURNAL'} to={'/my-mentorship'} />
        <DropdownItem title={'MY WELLNESS JOURNAL'} to={'/wellness-journal'} />
        <DropdownItem
          title={'MY PERSONAL FINANCE JOURNAL'}
          to={'/student-personal-finance'}
        />
        <DropdownItem
          title={'MY LEADERSHIP JOURNAL'}
          to={'/student-leadership'}
        />
      </ParentDropdownItem>

      <SidebarItem
        to={'/my-portfolio'}
        className={`${
          location.pathname.includes('my-portfolio') ? 'active' : ''
        }`}
        srcImage={Group3888Image}
        title='MY PORTFOLIO'
        isDropdown={false}
      /> */}
      </ul>
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        style={{ marginBottom: '55%' }}
      >
        <li>
          <button className='sidebar-button'>
            <img className='rotated' src={ExpandLogo} alt='Expand' />
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
          title='My account'
          isDropdown={false}
        />

        <li className='sub-li'>
          <Link>
            <div className='d-flex w-100' style={{ alignItems: 'center' }}>
              <Col md='2' className='col-2 icon_container'>
                <img className='profile-photo' src={ProfilePhoto} alt='Icon' />
              </Col>
              <div className='flex-grow-1 ms-1 d-flex flex-column'>
                <span className='font-profile'>Kenia Anders</span>
                <span className='font-profile email-profile'>
                  {truncateEmail('keniaanders@gmail.com')}
                </span>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default InstructorSidebar
