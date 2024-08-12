import React, { useEffect, useState, useRef } from 'react'
// import React, { useState, useRef } from 'react'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { Link } from 'react-router-dom'
import { NavLink, useHistory } from 'react-router-dom/cjs/react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBell } from '@fortawesome/free-solid-svg-icons'
import Notifications from './notifications'
import { useDispatch, useSelector } from 'react-redux'
import { changeSidebarState } from '../../redux'
import focusIcon from '../../assets/images/focus_icon.png'
import focusIconWhite from '../../assets/images/focus_icon_white.png'
import { faHeart as heart } from '@fortawesome/free-regular-svg-icons'
import notesIcon from '../../assets/images/notes-icon.svg'
import notesIconHovered from '../../assets/images/notes-icon-active.svg'
import mySparkBlack from '../../assets/icons/Asset 1.svg'
import mySparkWhite from '../../assets/icons/Group 3819.svg'
import avator from '../../assets/images/profile-image.png'
import { getUserStory } from '../../redux/portfolio/Actions'
import HSGooglePlay from '../../assets/images/LTS-HS/Story in motion-01.svg'
import HSmySpark from '../../assets/images/LTS-HS/Spark .svg'
import HSCommunity from '../../assets/images/LTS-HS/Community-01.svg'

const MobileNavbar = (props) => {
  const dispatch = useDispatch()
  const notificationsRef = useRef(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const history = useHistory()
  const [showDropDown, setShowDropDown] = useState(false)
  const showModal = () => {
    props.setShowContactModal(true)
  }

  useEffect(() => {
    dispatch(getUserStory())
  }, [])
  const userStory = useSelector((state) => state.portfolio.whoSection.userStory)
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light mobile-menu'>
      <div
        className='navbar-mobile'
        style={{
          display: 'flex',

          width: '100%'
          // height: '50px'
        }}
      >
        {/* <div className='container-fluid'> */}
        <div style={{ display: 'flex' }} className='navbar-topbtn-mobile'>
          <button
            type='button'
            id='sidebarCollapse'
            className='btn'
            style={{
              backgroundColor: '#01c5d1',
              // fontSize: '10px',
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
            // className='btn d-inline-block '
            className='btn navbar-dropdown-mobile'
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
        </div>
        {/* <div className='col-2 d-flex flex-row-reverse navbar-icon-menu'> */}
        <ul className='navbar-nav mt-1 navbar-icon-list navbar-list-margin'>
          <div className='navbar-top-icons' style={{ display: 'flex' }}>
            <NavbarIcon
              to={'/story-in-motion'}
              cn={'hs-icon'}
              srcWithFocus={HSGooglePlay}
            />
            <NavbarIcon
              to={'/my-spark/widgets'}
              cn={'spark-icon'}
              srcWithFocus={HSmySpark}
            />
            <NavbarIcon
              to={'/my-classroom'}
              cn={'comm-icon my-auto'}
              srcWithFocus={HSCommunity}
              width={'55px'}
              height={'45px'}
            />
          </div>

          <div className='navbar-bottom-icons' style={{ display: 'flex' }}>
            <div
              className='my-auto navbar-icons-border'
              style={{ borderRight: '1px solid #BBBDBF', height: '20px' }}
            ></div>
            <div className='nav-item my-auto me-2 position-relative'>
              <a
                className={`nav-link icon-menu px-2 my-auto nav-notifications position-relative ${
                  showNotifications ? 'active' : ''
                }`}
                onClick={() => setShowNotifications((state) => !state)}
                href
              >
                <FontAwesomeIcon
                  icon={faBell}
                  style={{
                    fontSize: '30px',
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
              {showNotifications && (
                <Notifications
                  unreadNotifications={props.unreadNotifications}
                  notifications={props.notifications}
                  setShowNotifications={setShowNotifications}
                  setUnreadNotifications={props.setUnreadNotifications}
                  notificationsRef={notificationsRef}
                />
              )}
            </div>
            <div className='nav-item my-auto me-2'>
              <NavLink
                className={`nav-link icon-menu px-2 my-auto `}
                to={'/savedMedia'}
              >
                <FontAwesomeIcon
                  icon={heart}
                  style={{ fontSize: '30px' }}
                  className='pt-1'
                />
              </NavLink>
            </div>

            <div className='nav-item notes-nav my-auto me-2 '>
              <NavLink
                className={`nav-link icon-menu`}
                to={
                  props.firstNote !== ''
                    ? `${`/my-notes/${props.firstNote}`}`
                    : '/my-notes'
                }
              >
                <div style={{ padding: '0px 9px' }}>
                  {/* <img
                      src={notesIconHovered}
                      className='d-none focus-icon'
                      width='27px'
                      alt='note'
                    /> */}
                  <img
                    src={notesIcon}
                    className='not-focus-icon'
                    width='27px'
                    alt='note'
                  />
                </div>
              </NavLink>
            </div>
          </div>
          <button
            // className='btn d-inline-block '
            className='btn navbar-dropdown-desktop'
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
        </ul>
        {/* </div> */}
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
                userStory?.data?.userImageUrl
                  ? userStory?.data?.userImageUrl
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
              MY ARCHIVED PORTFOLIO
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
              axiosInstance
                .put('/myPerformanceData/updateActivity/endTime', {
                  isActive: false
                })
                .then((response) => {
                  if (response) history.push('/logout')
                })
                .catch((error) => {
                  console.error('Error updating activity:', error)
                })
                .finally(() => {
                  // history.push('/logout')
                })
            }}
          >
            <IntlMessages id='navigation.logout' />
          </div>
        </div>
      </div>
      {/* </div> */}
    </nav>
  )
}

const NavbarIcon = (props) => {
  return (
    <li className='nav-item  my-auto'>
      <NavLink
        className={`nav-link m-0 p-0 icon-menu ${props.cn}`}
        to={props.to}
      >
        <img
          src={props.srcWithFocus}
          width={props.width}
          height={props.height}
          style={props.style}
          alt={props.alt}
        />
      </NavLink>
    </li>
  )
}

export default MobileNavbar
