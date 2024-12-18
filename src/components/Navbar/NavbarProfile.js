import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import avator from '../../assets/images/profile-image.png'
import NavbarProfileMenu from './NavbarProfileMenu'

const NavbarProfile = ({
  setShowNotifications,
  user,
  setCountStudentOfInstructor,
  userRole
}) => {
  const [showDropDown, setShowDropDown] = useState(false)
  const userBasicInfo = useSelector(
    (state) => state.portfolio.whoSection.userBasicInfo
  )

  const closeDropDownMenu = () => {
    if (showDropDown) {
      setTimeout(() => {
        setShowDropDown(false)
      }, 200)
    }
  }

  return (
    <li
      className='nav-item dropdown'
      onClick={() => setShowNotifications(false)}
    >
      <div
        className='dropdown-li'
        tabIndex='0'
        onBlur={() => closeDropDownMenu()}
      >
        <button
          className='btn btn-secondary dropdown-toggle menu-dropdown'
          type='button'
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
          onClick={() => setShowDropDown((preState) => !preState)}
        >
          <div className='profile-dropdown me-1 ms-3 desktop-menu d-none d-xl-block'>
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
            <h5>{user?.name ? user?.name : localStorage.getItem('name')}</h5>
            <p>{user?.email}</p>
          </div>
        </button>
        <NavbarProfileMenu
          showDropDown={showDropDown}
          setShowDropDown={setShowDropDown}
          setCountStudentOfInstructor={setCountStudentOfInstructor}
          userRole={userRole}
        />
      </div>
    </li>
  )
}

export default NavbarProfile
