import React from 'react'
import FolderSidebarImage from '../../assets/images/HS-Sidebar-Icons/Dashboard (Full)-1200x.png'
import SidebarItem from './SidebarItem'
import ParentSidebarItem from './ParentSidebarItem'
import ParentDropdownItem from './ParentDropdownItem'
import DropdownItem from './DropdownItem'
import { useDispatch, useSelector } from 'react-redux'
import { setAccordionToggled } from '../../redux'
import { useLocation } from 'react-router-dom/cjs/react-router-dom'

const Body = (props) => {
  const { isAdmin } = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const location = useLocation()
  return (
    <ul
      className='list-unstyled components sidebar-menu-item'
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
            <DropdownItem title={'My courses & management'} to={'/my-school'} />
          </ParentDropdownItem>
        </>
      )}
      <ParentSidebarItem
        href='#myLtsEDU'
        aria-controls='myLtsEDU'
        srcImage={FolderSidebarImage}
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
        srcImage={FolderSidebarImage}
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
        srcImage={FolderSidebarImage}
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
        srcImage={FolderSidebarImage}
        title='JOURNALS'
        isDropdown={true}
      />
      <ParentDropdownItem id={'journals'}>
        <DropdownItem title={'LTS JOURNAL'} to={'/student-lts'} />
        <DropdownItem title={'MENTORSHIP JOURNAL'} to={'/my-mentorship'} />
        <DropdownItem title={'WELLNESS JOURNAL'} to={'/student-wellnes'} />
        <DropdownItem
          title={'PERSONAL FINANCE JOURNAL'}
          to={'/student-personal-finance'}
        />
        <DropdownItem title={'LEADERSHIP JOURNAL'} to={'/student-leadership'} />
      </ParentDropdownItem>

      <SidebarItem
        to={'/edit-portfolio'}
        className={`${
          location.pathname.includes('edit-portfolio') ? 'active' : ''
        }`}
        srcImage={FolderSidebarImage}
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
      </ParentDropdownItem> */}
    </ul>
  )
}

export default Body
