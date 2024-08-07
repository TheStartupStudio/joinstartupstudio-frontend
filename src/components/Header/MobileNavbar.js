import React, { useState } from 'react'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { Link } from 'react-router-dom'
import { NavLink, useHistory } from 'react-router-dom/cjs/react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBell } from '@fortawesome/free-solid-svg-icons'
import Notifications from './notifications'
import { useDispatch } from 'react-redux'
import { changeSidebarState } from '../../redux'
import focusIcon from '../../assets/images/focus_icon.png'
import focusIconWhite from '../../assets/images/focus_icon_white.png'
import { faHeart as heart } from '@fortawesome/free-regular-svg-icons'
import notesIcon from '../../assets/images/notes-icon.svg'
import notesIconHovered from '../../assets/images/notes-icon-active.svg'
import mySparkBlack from '../../assets/icons/Asset 1.svg'
import mySparkWhite from '../../assets/icons/Group 3819.svg'
import avator from '../../assets/images/profile-image.png'

const MobileNavbar = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [showDropDown, setShowDropDown] = useState(false)
  const showModal = () => {
    props.setShowContactModal(true)
  }
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light mobile-menu'>
      <div className='container-fluid'>
        <button
          type='button'
          id='sidebarCollapse'
          className='btn'
          style={{
            backgroundColor: '#01c5d1'
          }}
          onClick={() => {
            dispatch(changeSidebarState(!props.sideBarState))
            setShowDropDown(false)
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className='col-2 d-flex ms-auto flex-row-reverse'>
          <button
            className='btn d-inline-block'
            type='button'
            // style={{ display: 'none' }}
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
          <ul className='navbar-nav my-auto'>
            <li className='nav-item my-auto position-relative nav-notifications-li'>
              <a
                className={`nav-link icon-menu px-2 my-auto nav-notifications position-relative ${
                  props.showNotifications ? 'active' : ''
                }`}
                onClick={() =>
                  props.setShowNotifications(!props.showNotifications)
                }
                href
              >
                <FontAwesomeIcon
                  icon={faBell}
                  style={{
                    fontSize: '26px',
                    color: '#333D3D'
                  }}
                  className='nav-bell-icon pt-1'
                />
                {props.unreadNotifications > 0 && (
                  <span className='badge nofitication-badge'>
                    {props.unreadNotifications}
                  </span>
                )}
              </a>
              {props.showNotifications && (
                <Notifications
                  unreadNotifications={props.unreadNotifications}
                  notifications={props.notifications}
                  setShowNotifications={props.setShowNotifications}
                  setUnreadNotifications={props.setUnreadNotifications}
                />
              )}
            </li>
            <div
              onClick={() => props.setShowNotifications(false)}
              style={{ display: 'inherit' }}
            >
              <li className='nav-item spotlight-nav my-auto'>
                <NavLink
                  className={`nav-link icon-menu px-2 me-2 my-auto`}
                  to={'/spotlight'}
                >
                  <div>
                    <img
                      src={focusIconWhite}
                      className='d-none focus-icon'
                      width='28px'
                      alt='note'
                    />
                    <img
                      src={focusIcon}
                      className='not-focus-icon'
                      width='28px'
                      alt='note'
                    />
                  </div>
                </NavLink>
              </li>
              <li className='nav-item my-auto'>
                <NavLink
                  className={`nav-link icon-menu px-2 me-2 my-auto`}
                  to={'/savedMedia'}
                >
                  <FontAwesomeIcon
                    icon={heart}
                    style={{ fontSize: '26px' }}
                    className='pt-1'
                  />
                </NavLink>
              </li>
              {/*  */}
              <li className='nav-item notes-nav my-auto'>
                <NavLink
                  className={`nav-link px-2 me-1 icon-menu`}
                  to={
                    props.firstNote !== ''
                      ? `${`/my-notes/${props.firstNote}`}`
                      : '/my-notes'
                  }
                >
                  <div>
                    <img
                      src={notesIconHovered}
                      className='d-none focus-icon'
                      width='25px'
                      alt='note'
                    />
                    <img
                      src={notesIcon}
                      className='not-focus-icon'
                      width='25px'
                      alt='note'
                    />
                  </div>
                </NavLink>
              </li>
              <li className='nav-item notes-nav my-auto '>
                <NavLink
                  className={`nav-link px-2 me-1 icon-menu`}
                  to={'/my-spark/widgets'}
                >
                  <div>
                    <img
                      src={mySparkWhite}
                      className='d-none focus-icon'
                      width='21px'
                      alt='note'
                    />
                    <img
                      src={mySparkBlack}
                      className='not-focus-icon'
                      width='21px'
                      alt='note'
                    />
                  </div>
                </NavLink>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <div className='dropdown-li'>
        <button
          className='btn btn-secondary  menu-dropdown'
          type='button'
          // style={{ display: 'none' }}
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
          onClick={() => setShowDropDown((preState) => !preState)}
        >
          <div className='profile-dropdown me-1 ms-3 desktop-menu'>
            <img
              src={
                props.mainState?.user?.user?.user?.profileImage
                  ? props.mainState?.user?.user?.user?.profileImage
                  : avator
              }
              alt='Profile'
            />
          </div>
          <div className='profile-dropdown-info desktop-menu'>
            {/* <h5>{name}</h5> */}
            <p>{props?.user?.email}</p>
          </div>
        </button>
        <div
          className={`dropdown-menu${
            showDropDown ? 'show1' : ''
          } p-0 text-uppercase`}
          aria-labelledby='dropdownMenuButton'
        >
          <Link
            className='dropdown-item py-2 dropdown-menu-hover'
            to='/account'
            onClick={() => setShowDropDown((preState) => !preState)}
          >
            <IntlMessages id='my_account.page_title' />
          </Link>
          {
            <Link
              className='dropdown-item py-2 dropdown-menu-hover'
              to='/edit-portfolio'
              onClick={() => setShowDropDown((preState) => !preState)}
            >
              MY PORTFOLIO
            </Link>
          }
          {props.allowToShow ? (
            <Link
              className='dropdown-item py-2 dropdown-menu-hover'
              to='#'
              onClick={() => {
                props.setCountStudentOfInstructor(true)
                setShowDropDown((preState) => !preState)
              }}
            >
              Admin panel
            </Link>
          ) : (
            ''
          )}
          <Link
            className='dropdown-item py-2 dropdown-menu-hover'
            to='#'
            onClick={() => {
              showModal()
              setShowDropDown((preState) => !preState)
            }}
          >
            SUPPORT
          </Link>
          <div
            className='dropdown-item py-2 dropdown-menu-hover'
            onClick={() => {
              history.push('/logout')
            }}
          >
            <IntlMessages id='navigation.logout' />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MobileNavbar
