import Notifications from './notifications'
import { faAngleLeft, faBars, faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavLink, useHistory } from 'react-router-dom/cjs/react-router-dom'
import HSmySpark from '../../assets/images/LTS-HS/Spark .svg'
import HSGooglePlay from '../../assets/images/LTS-HS/Story in motion-01.svg'
import HSCommunity from '../../assets/images/LTS-HS/Community-01.svg'
import { faHeart as heart } from '@fortawesome/free-regular-svg-icons'
import notesIcon from '../../assets/images/notes-icon.svg'
import notesIconHovered from '../../assets/images/notes-icon-active.svg'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import avator from '../../assets/images/profile-image.png'
import { useDispatch, useSelector } from 'react-redux'
import { changeSidebarState } from '../../redux'

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

const Navbar = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const notificationsRef = useRef(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false)
  const [showMobileDropDown, setShowMobileDropDown] = useState(false)
  const { isAdmin } = useSelector((state) => state.user.user)
  const backButton = useSelector((state) => state.backButton)

  const showModal = () => {
    props.setShowContactModal(true)
  }

  const handleMobileNavBar = () => {
    if (showMobileDropDown === true) {
      setShowMobileDropDown(false)
    }
    dispatch(changeSidebarState(!props.sideBarState))
  }

  const closeDropDownMenu = () => {
    if (showDropDown) {
      setTimeout(() => {
        setShowDropDown(false)
      }, 200)
    }
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light desktop-menu px-xl-2'>
      <div className='container-fluid'>
        <button
          type='button'
          id='sidebarCollapse'
          className='btn'
          style={{
            backgroundColor: '#01c5d1'
          }}
          onClick={() => {
            handleMobileNavBar()
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav  mt-1'>
            {backButton.state && (
              <div style={{ display: 'inherit' }}>
                <li className='nav-item my-auto'>
                  <button
                    className={`nav-link icon-menu px-2 me-2 my-auto `}
                    onClick={() => history.push('/' + backButton.location)}
                    style={{ border: 'none' }}
                  >
                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      style={{
                        fontSize: '26px'
                      }}
                      className='pt-1'
                    />
                  </button>
                </li>
              </div>
            )}
          </ul>
          <ul className='navbar-nav ms-auto mt-1'>
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

            <div style={{ display: 'inherit' }}>
              <div
                className='my-auto mx-3'
                style={{ borderRight: '1px solid #BBBDBF', height: '20px' }}
              ></div>
              <li className='nav-item my-auto me-2 position-relative'>
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
              </li>
              <li className='nav-item my-auto me-2'>
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
              </li>

              <li className='nav-item notes-nav my-auto me-2 '>
                <NavLink
                  className={`nav-link icon-menu`}
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
                      width='27px'
                      alt='note'
                    />
                    <img
                      src={notesIcon}
                      className='not-focus-icon'
                      width='27px'
                      alt='note'
                    />
                  </div>
                </NavLink>
              </li>
              <li className='nav-item dropdown ms-2'>
                {/* <Dropdown showModal={showModal} close={closeProfileDropDown} /> */}
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
                        src={
                          props.mainState?.user?.user?.user?.profileImage
                            ? props.mainState?.user?.user?.user?.profileImage
                            : avator
                        }
                        alt='Profile'
                      />
                    </div>
                    <div className='profile-dropdown-info desktop-menu'>
                      <h5>
                        {props.user?.name
                          ? props.user?.name
                          : localStorage.getItem('name')}
                      </h5>
                      <p>{props.user?.email}</p>
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

                    <Link
                      className='dropdown-item py-2 dropdown-menu-hover'
                      to='/edit-portfolio'
                      onClick={() => setShowDropDown((preState) => !preState)}
                    >
                      MY PORTFOLIO
                    </Link>

                    <Link
                      onClick={() => setShowDropDown((preState) => !preState)}
                      to='/briefings'
                      className='dropdown-item py-2 dropdown-menu-hover'
                    >
                      MY NEWS BRIEFINGS ARCHIVE
                    </Link>

                    <li>
                      <Link
                        onClick={() => setShowDropDown((preState) => !preState)}
                        to='/resources'
                        className='dropdown-item py-2 dropdown-menu-hover'
                      >
                        MY RESOURCES
                      </Link>
                    </li>
                    {isAdmin && (
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
                    )}
                    {/* <Link
                      className="dropdown-item py-2 dropdown-menu-hover"
                      to="#"
                      onClick={() => {
                        showModal()
                        setShowDropDown((preState) => !preState)
                      }}
                    >
                      SUPPORT
                    </Link> */}
                    <Link
                      className='dropdown-item py-2 dropdown-menu-hover'
                      onClick={() => {
                        axiosInstance
                          .put('/myPerformanceData/updateActivity/endTime', {
                            isActive: false
                          })
                          .then((response) => {
                            history.push('/logout')
                          })
                          .catch((error) => {
                            console.error('Error updating activity:', error)
                            // history.push('/logout')
                          })
                          .finally(() => {})
                      }}
                    >
                      <IntlMessages id='navigation.logout' />
                    </Link>
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
