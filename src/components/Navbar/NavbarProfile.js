import React, { useEffect, useState } from 'react'
import avator from '../../assets/images/profile-image.png'
import NavbarProfileMenu from './NavbarProfileMenu'

const NavbarProfile = ({
  setShowNotifications,
  user,
  setCountStudentOfInstructor,
  userRole
}) => {
  const [showDropDown, setShowDropDown] = useState(false)
  let timeoutId

  const closeDropDownMenu = () => {
    if (showDropDown) {
      timeoutId = setTimeout(() => {
        setShowDropDown(false)
      }, 200)
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId) // Cleanup timeout on unmount
    }
  }, [])

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
              src={user?.profileImage ? user?.profileImage : avator}
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
