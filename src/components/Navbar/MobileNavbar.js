import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { changeSidebarState } from '../../redux'
import avator from '../../assets/images/profile-image.png'
import { getUserBasicInfo } from '../../redux/portfolio/Actions'
import NavbarProfileMenu from './NavbarProfileMenu'
import NavbarListItems from './NavbarListItems'

const MobileNavbar = (props) => {
  const dispatch = useDispatch()
  const [showDropDown, setShowDropDown] = useState(false)

  useEffect(() => {
    dispatch(getUserBasicInfo())
  }, [dispatch])

  const userBasicInfo = useSelector(
    (state) => state.portfolio.whoSection.userBasicInfo
  )
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light mobile-menu'>
      <div className='navbar-mobile d-flex w-100'>
        <div className='navbar-topbtn-mobile d-flex'>
          <button
            type='button'
            id='sidebarCollapse'
            className='btn'
            style={{
              backgroundColor: '#01c5d1',
              width: '40px',
              height: '40px'
            }}
            onClick={() => {
              dispatch(changeSidebarState(!props.sideBarState))
              setShowDropDown(false)
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          <button
            className='btn navbar-dropdown-mobile'
            type='button'
            id='dropdownMenuButton'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            onClick={() => {
              setShowDropDown((preState) => !preState)
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <NavbarListItems
          {...props}
          showDropDown={showDropDown}
          setShowDropDown={setShowDropDown}
          isMobile={true}
        />
      </div>
      <div className='dropdown-li'>
        <button
          className='btn btn-secondary  menu-dropdown'
          type='button'
          style={{ display: 'none' }}
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
          onClick={() => setShowDropDown((preState) => !preState)}
        >
          <div className='profile-dropdown me-1 ms-3 desktop-menu'>
            <img
              // src={
              //   props.mainState?.user?.user?.user?.profileImage
              //     ? props.mainState?.user?.user?.user?.profileImage
              //     : avator
              // }
              src={
                userBasicInfo?.data?.userImageUrl
                  ? userBasicInfo?.data?.userImageUrl
                  : avator
              }
              alt='Profile'
            />
          </div>
          <div className='profile-dropdown-info desktop-menu'>
            <p>{props?.user?.email}</p>
          </div>
        </button>
        <NavbarProfileMenu
          showDropDown={showDropDown}
          setShowDropDown={setShowDropDown}
          setCountStudentOfInstructor={props.setCountStudentOfInstructor}
          isMobile={true}
        />
      </div>
    </nav>
  )
}

export default MobileNavbar
