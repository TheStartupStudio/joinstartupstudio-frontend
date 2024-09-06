import React from 'react'
import FolderSidebarImage from '../../assets/images/HS-Sidebar-Icons/Dashboard (Full)-1200x.png'
import LtsEduImage from '../../assets/images/HS-Sidebar-Icons/lts-edu-sidebar.svg'
import ClassroomImage from '../../assets/images/HS-Sidebar-Icons/classroom-sidebar.svg'
import MarketImage from '../../assets/images/HS-Sidebar-Icons/market-sidebar.svg'
import JournalImage from '../../assets/images/HS-Sidebar-Icons/journal-sidebar.svg'
import SparkImage from '../../assets/images/HS-Sidebar-Icons/spark-sidebar.svg'
import SidebarItem from './SidebarItem'
import ParentSidebarItem from './ParentSidebarItem'
import ParentDropdownItem from './ParentDropdownItem'
import DropdownItem from './DropdownItem'
import { useDispatch, useSelector } from 'react-redux'
import { setAccordionToggled } from '../../redux'
import { useLocation } from 'react-router-dom/cjs/react-router-dom'
import IntlMessages from '../../utils/IntlMessages'
import Group3888Image from '../../assets/images/HS-Sidebar-Icons/Group 3888/Group 3888@2x.png'

const Body = (props) => {
  const { isAdmin } = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const location = useLocation()
  return (
    <ul
      className='list-unstyled components sidebar-menu-item sidebar-menu-list'
      id='side-menu-main'
    >
      <SidebarItem
        onClick={() => {
          dispatch(setAccordionToggled(false))
          props.hideHeaderIcons()
        }}
        to={'/dashboard'}
        className={`${location.pathname.includes('dashboard') ? 'active' : ''}`}
        srcImage={FolderSidebarImage}
        title='MY Dashboard'
        isDropdown={false}
      />
      {isAdmin && (
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
            <DropdownItem title={'MY IMMERSION'} to={'/my-school'} />
            <DropdownItem
              title={'My courses & credentials'}
              to={'/courses&credentials'}
            />
            <DropdownItem
              title={'My guest speakers'}
              to={'/my-guest-speakers'}
            />
          </ParentDropdownItem>
        </>
      )}
      <ParentSidebarItem
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
        {/* <DropdownItem
          allowed={isAdmin}
          title={'USER MANAGEMENT'}
          to={'/user-management'}
        /> */}
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
        <DropdownItem title={'PATHWAYS'} to={'/pathways'} />
        <DropdownItem title={'IMMERSION'} to={'/my-immersion'} />
        <DropdownItem
          disabled={true}
          title={'COURSE & CREDENTIALS'}
          to={'/course-credentials'}
        />
        <DropdownItem title={'SPOTLIGHT'} to={'/spotlight'} />
      </ParentDropdownItem>
      <ParentSidebarItem
        ariaControls='journals'
        href='#journals'
        srcImage={JournalImage}
        title='JOURNALS'
        isDropdown={true}
      />
      <ParentDropdownItem id={'journals'}>
        <DropdownItem title={'MY LTS JOURNAL'} to={'/student-lts'} />
        <DropdownItem title={'MY MENTORSHIP JOURNAL'} to={'/my-mentorship'} />
        <DropdownItem title={'MY WELLNESS JOURNAL'} to={'/student-wellnes'} />
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
      />
      {/* <ParentSidebarItem
        ariaControls="mySpark"
        href="#mySpark"
        srcImage={FolderSidebarImage}
        title="MY SPARK"
        isDropdown={true}
      />
      <ParentDropdownItem id={'mySpark'}>
        <DropdownItem title={'SPARK WIDGETS'} to={'/my-spark/widgets'} />
        <DropdownItem title={'SPARK ARCHIVE'} to={'/my-spark/archive'} />
      </ParentDropdownItem>
      <SidebarItem
        to={'/my-portfolio'}
        className={`${
          location.pathname.includes('my-portfolio') ? 'active' : ''
        }`}
        srcImage={SparkImage}
        title='MY PORTFOLIO'
        isDropdown={false}
      />
      */}
    </ul>
  )
}

export default Body
