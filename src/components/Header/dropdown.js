import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IntlMessages from '../../utils/IntlMessages'
import avator from '../../assets/images/profile-image.png'

const Dropdown = (props) => {
  const { user } = useSelector((state) => state.user.user)
  const profileImage = useSelector((state) => state.user.profileImage)
  const [showDropDown, setShowDropDown] = useState(false)

  const closeDropDownMenu = () => {
    if (showDropDown) {
      setTimeout(() => {
        setShowDropDown(false)
      }, 100)
    }
  }

  return (
    <div
      className='dropdown-li me-md-5 me-lg-0'
      tabIndex='0'
      onBlur={() => closeDropDownMenu()}
    >
      <button
        className='btn btn-secondary dropdown-toggle menu-dropdown'
        style={{ outline: 'none' }}
        type='button'
        id='dropdownMenuButton'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded='false'
        onClick={() => setShowDropDown((preState) => !preState)}
      >
        <div className='profile-dropdown ms-xl-1 me-xl-3 desktop-menu'>
          <img
            src={
              profileImage && profileImage !== 'undefined'
                ? profileImage
                : avator
            }
            alt='Profile Image'
          />
        </div>
        <div className='profile-dropdown-info desktop-menu'>
          <h5>{user.name}</h5>
          <p>{user.email}</p>
        </div>
      </button>
      <div
        className={`dropdown-menu ${showDropDown ? ' show' : ''} p-0`}
        aria-labelledby='dropdownMenuButton'
      >
        <Link
          className='dropdown-item py-2'
          to='/profile'
          onClick={() => setShowDropDown((preState) => !preState)}
        >
          <IntlMessages id='navigation.profile' />
        </Link>
        <Link className='dropdown-item py-2' to='#' onClick={props.showModal}>
          <IntlMessages id='navigation.contact_us' />
        </Link>
        <Link
          className='dropdown-item py-2'
          to='#'
          onClick={props.showMisconductModal}
        >
          REPORT MISCONDUCT
        </Link>
        <a
          className='dropdown-item py-2 dropdown-menu-hover'
          href='/MyStartupProfile'
        >
          Startup profile
        </a>
        <Link className='dropdown-item py-2' to='/logout'>
          <IntlMessages id='navigation.logout' />
        </Link>
      </div>
    </div>
  )
}

export default Dropdown
