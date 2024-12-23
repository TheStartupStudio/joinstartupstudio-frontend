import React from 'react'
import FolderSidebarImage from '../../assets/images/HS-Sidebar-Icons/Dashboard (Full)-1200x.png'
import SidebarItem from './SidebarItem'
import ParentSidebarItem from './ParentSidebarItem'
import ParentDropdownItem from './ParentDropdownItem'
import DropdownItem from './DropdownItem'
import { useDispatch, useSelector } from 'react-redux'
import { setAccordionToggled } from '../../redux'
import Group3884Image from '../../assets/images/HS-Sidebar-Icons/Group-3884@2x.png'
import Group3885Image from '../../assets/images/HS-Sidebar-Icons/Group-3885@2x.png'
import Group3887Image from '../../assets/images/HS-Sidebar-Icons/Group-3887@2x.png'
import Group3888Image from '../../assets/images/HS-Sidebar-Icons/Group-3888@2x.png'

const StudentSidebar = (props) => {
  const { isAdmin } = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

  return (
    <ul
      className='list-unstyled components sidebar-menu-item'
      id='side-menu-main'
    >
      <SidebarItem
        onClick={() => {
          dispatch(setAccordionToggled(false))
          props.props.hideHeaderIcons()
        }}
        to='/dashboard'
        className={`sidebar-item-notdropdown`}
        srcImage={FolderSidebarImage}
        title='MY Dashboard'
        isDropdown={false}
      />
      <ParentSidebarItem
        aria-controls='whoAmI'
        href='#whoAmI'
        srcImage={Group3884Image}
        title='WHO AM I?'
        isDropdown={true}
      />
      <ParentDropdownItem id='whoAmI'>
        <DropdownItem title='My Lts Journal' to='/lts-journal' />
        <DropdownItem title='My Mentorship Journal' to='/my-mentorship' />
        <DropdownItem title='My Wellness Journal' to='/wellness-journal' />
        <DropdownItem
          title='My Personal Finance Journal'
          to='/student-personal-finance'
        />
        <DropdownItem title='My Leadership Journal' to='/student-leadership' />
      </ParentDropdownItem>
      <ParentSidebarItem
        aria-controls='whatCanIDo'
        href='#whatCanIDo'
        srcImage={Group3885Image}
        title='WHAT CAN I DO?'
        isDropdown={true}
      />
      <ParentDropdownItem id='whatCanIDo'>
        <DropdownItem title='MY Pathways' to='/pathways' />
        <DropdownItem title='MY Immersion' to='/my-immersion' />
      </ParentDropdownItem>
      <ParentSidebarItem
        aria-controls='howDoIProveIt'
        href='#howDoIProveIt'
        srcImage={Group3887Image}
        title='HOW DO I PROVE IT?'
        isDropdown={true}
      />
      <ParentDropdownItem id='howDoIProveIt'>
        <DropdownItem
          title='MY MARKET-READY GUIDE'
          to='/My-Market-Ready-Guide'
        />
        <DropdownItem title='Certification System' to='/iamr' />
      </ParentDropdownItem>
      <SidebarItem
        onClick={() => {
          dispatch(setAccordionToggled(false))
          props.props.hideHeaderIcons()
        }}
        to='/my-portfolio'
        className={`sidebar-item-notdropdown`}
        srcImage={Group3888Image}
        title='MY PORTFOLIO'
        isDropdown={false}
      />
    </ul>
  )
}

export default StudentSidebar
