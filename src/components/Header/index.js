import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import ReactGA from 'react-ga'
import { Auth } from 'aws-amplify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import {
  changeSidebarState,
  getAllNotes,
  getAllPodcast,
  updateTnC
} from '../../redux'
// import Language from '../Language'
import ContactUsModal from '../Modals/contactUsModal'
import MisconductModal from '../Modals/misconductModal'
import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'
import triangleAlertIcon from '../../assets/images/alert-triangle-icon.svg'
import notesIcon from '../../assets/images/notes-icon.svg'
import notesIconHovered from '../../assets/images/notes-icon-active.svg'
// import journalIcon from '../../assets/images/journals-icon.svg'
// import journalIconHovered from '../../assets/images/journals-icon-active.svg'
import focusIcon from '../../assets/images/focus_icon.png'
import focusIconWhite from '../../assets/images/focus_icon_white.png'
import avator from '../../assets/images/profile-image.png'
import { faHeart as heart } from '@fortawesome/free-regular-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import socket from '../../utils/notificationSocket'
import Notifications from './notifications'
import TermAndCondition from './TermAndCondition'
import StudentOfInstructors from '../GetInstructorStudents/index.js'
import useOnClickOutside from 'use-onclickoutside'

function Header(props) {
  const { user } = useSelector((state) => state.user.user)
  const mainState = useSelector((state) => state)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const notes = useSelector((state) => state.course)
  const [TnCModal, setOpenTnCModal] = useState(false)

  const [firstNote, setFirstNote] = useState('')
  // const [noteActive, setNoteActive] = useState(false)
  // const [noteHovered, setNoteHovered] = useState(false)
  // const [noteActiveMobile, setNoteActiveMobile] = useState(false)
  const [mediaHovered, setMediaHovered] = useState(false)
  // const [spotlightHovered, setSpotlightHovered] = useState(false)
  // const [spotlightHoveredMobile, setSpotlightHoveredMobile] = useState(false)
  // const [communityHovered, setCommunityHovered] = useState(false)
  // const [firstJournal, setFirstJournal] = useState('')
  // const [journalActive, setJournalActive] = useState(false)
  // const [journalHovered, setJournalHovered] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState(null)
  const [currentUser, setCurrentUser] = useState({})
  const [userMessage, setUserMessage] = useState('')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showMisconductReportModal, setShowMisconductReportModal] =
    useState(false)
  const [showMobileDropDown, setShowMobileDropDown] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false)
  const [countStudentOfInstructor, setCountStudentOfInstructor] =
    useState(false)
  // const profileImage = useSelector((state) => state.user.profileImage)
  const name = useSelector((state) => state.user.user.user.name)
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [allowToShow, setAllowToShow] = useState(false)
  const notificationsRef = useRef(null)
  useOnClickOutside(notificationsRef, () => {
    setTimeout(() => {
      setShowNotifications(false)
    }, 100)
  })

  const hasAccess = async () => {
    await axiosInstance
      .get('/studentsInstructorss/has-access')
      .then((response) => {
        if (response.data.allow) {
          setAllowToShow(true)
        } else {
          setAllowToShow(false)
        }
      })
      .catch((e) => e)
  }

  /**
   * we are using these temporary vars
   * since state is not updating immediately
   */

  const dispatch = useDispatch()

  // const noteActive =
  //   window.location.pathname.includes('/my-notes') ||
  //   window.location.pathname.includes('/sample-note')
  //     ? true
  //     : false
  // const journalActive = window.location.pathname.includes(`/my-journal`)
  //   ? true
  //   : false

  useEffect(() => {
    isUserAgredToTnC()
    ReactGA.initialize('UA-130670492-3')
    ReactGA.pageview(window.location.href)
  })

  // useEffect(() => {
  //   if (window.location.pathname.includes('/my-notes')) {
  //     setNoteActive(true)
  //   } else if (window.location.pathname.includes(`/my-journal`)) {
  //     setJournalActive(true)
  //   }
  //   getFirstJournal()
  // }, [])

  useEffect(() => {
    socket?.emit('newNotificationUser', {
      name: user.name,
      id: user.id
    })

    socket?.on('getNotification', (data) => {
      setNotifications((notifications) => [
        {
          ...data.notification,
          Sender: { ...data.Sender }
        },
        ...notifications
      ])
      setUnreadNotifications(
        (unreadNotifications) => Number(unreadNotifications) + 1
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    checkIfUserHasVerifiedEmail()

    axiosInstance.get(`/notifications/${user.id}`).then((res) => {
      if (res.data.notifications.length > 0) {
        setNotifications(res.data.notifications)
      }

      setUnreadNotifications(res.data.unreadNotifications)
    })
    hasAccess()
  }, [])

  useEffect(
    function () {
      // dispatch(getAllPodcast({}))
      dispatch(
        getAllNotes({
          userId: user.sub
        })
      )
    },
    [user.sub]
  )

  useEffect(() => {
    if (notes.notes?.length) {
      notes.notes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      setFirstNote(notes.notes[0].id)
    }
  }, [notes.notes])

  const closeDropDownMenu = () => {
    if (showDropDown) {
      setTimeout(() => {
        setShowDropDown(false)
      }, 200)
    }
  }

  const isUserAgredToTnC = () => {
    var pathArray = window.location.pathname.split('/')[1]
    if (!user.TnC && pathArray != 'terms') {
      setOpenTnCModal(true)
    }
  }

  // const getFirstJournal = async () => {
  //   await axiosInstance
  //     .get(`/journals/?month=1`)
  //     .then((response) => {
  //       setFirstJournal(response.data[0].Journals[0].id)
  //     })
  //     .catch((err) => err)
  // }

  const checkIfUserHasVerifiedEmail = async () => {
    await Auth.currentAuthenticatedUser({ bypassCache: true })
      .then((res) => {
        setCurrentUser(res)
        if (res.attributes['custom:isVerified'] === '1') {
          setVerifiedEmail(true)
        } else {
          setVerifiedEmail(false)
        }
      })
      .catch((err) => err)
  }

  const sendVerifyEmail = async () => {
    let params = {
      email: currentUser.attributes.email,
      universityCode: currentUser.attributes['custom:universityCode'],
      language: currentLanguage
    }
    setUserMessage('user.sending_verification_email')
    await axiosInstance
      .post(
        `${process.env.REACT_APP_SERVER_BASE_URL}users/verify-email`,
        params
      )
      .then(() => {
        setUserMessage('user.verification_email_sent')
      })
  }

  const showModal = () => {
    setShowContactModal(true)
  }

  const showMisconductModal = () => {
    setShowMisconductReportModal(true)
  }

  const closeModal = () => {
    setShowContactModal(false)
  }

  const handleMobileNavBar = () => {
    if (showMobileDropDown == true) {
      setShowMobileDropDown(false)
    }
    dispatch(changeSidebarState(!sideBarState))
  }

  return (
    <div>
      {window.location.href.includes('demo') ? null : verifiedEmail === false &&
        (window.location.href.includes('dashboard') ||
          window.location.href ===
            `${process.env.REACT_APP_CLIENT_BASE_URL}/account`) ? (
        <div className='verify-email'>
          {userMessage !== '' ? (
            <p>
              <IntlMessages id={`${userMessage}`} />
            </p>
          ) : (
            <p>
              <img className='mr-2' src={triangleAlertIcon} alt='triangle' />
              <IntlMessages id='user.verify_email' />
              <Link to='#' className='link' onClick={() => sendVerifyEmail()}>
                <IntlMessages id='user.click_to_verify_email' />
              </Link>
              <IntlMessages id='user.resend_verification_email' />
            </p>
          )}
        </div>
      ) : null}
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
            <ul className='navbar-nav ms-auto mt-1'>
              <li className='nav-item my-auto me-2 position-relative'>
                <a
                  className={`nav-link icon-menu px-2 my-auto nav-notifications position-relative ${
                    showNotifications ? 'active' : ''
                  }`}
                  onClick={() =>
                    !showNotifications && setShowNotifications(true)
                  }
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    style={{
                      fontSize: '26px',
                      color: '#333D3D'
                    }}
                    className='nav-bell-icon pt-1'
                  />
                  {unreadNotifications > 0 && (
                    <span className='badge nofitication-badge'>
                      {unreadNotifications}
                    </span>
                  )}
                </a>
                {showNotifications && (
                  <Notifications
                    unreadNotifications={unreadNotifications}
                    notifications={notifications}
                    setShowNotifications={setShowNotifications}
                    setUnreadNotifications={setUnreadNotifications}
                    notificationsRef={notificationsRef}
                  />
                )}
              </li>
              <div
                onClick={() => setShowNotifications(false)}
                style={{ display: 'inherit' }}
              >
                <li className='nav-item my-auto'>
                  <NavLink
                    className={`nav-link icon-menu px-2 me-2 my-auto`}
                    to={'/my-connections'}
                  >
                    <FontAwesomeIcon
                      icon={faUsers}
                      style={{
                        fontSize: '26px'
                      }}
                      className='pt-1'
                    />
                  </NavLink>
                </li>
                <li className='nav-item spotlight-nav my-auto'>
                  <NavLink
                    className={`nav-link icon-menu px-2 my-auto`}
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
                <div
                  className='my-auto mx-3'
                  style={{ borderRight: '1px solid #BBBDBF', height: '20px' }}
                ></div>
                <li className='nav-item my-auto me-2'>
                  <NavLink
                    onMouseOver={() => setMediaHovered(true)}
                    onMouseLeave={() => setMediaHovered(false)}
                    className={`nav-link icon-menu px-2 my-auto `}
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

                <li className='nav-item notes-nav my-auto me-5'>
                  <NavLink
                    className={`nav-link icon-menu`}
                    to={
                      firstNote !== ''
                        ? `${`/my-notes/${firstNote}`}`
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

                {/* <li className='nav-item dropdown mt-md-1 mt-xl-3 me-3'>
                <Language />
              </li> */}
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
                        {/* <img
                        src={
                          profileImage && profileImage !== 'undefined'
                            ? profileImage
                            : localStorage.getItem('profileImage') !== 'null'
                            ? localStorage.getItem('profileImage')
                            : avator
                        }
                        alt='Profile Image'
                      /> */}
                        <img
                          src={
                            mainState.user.user.user.profileImage
                              ? mainState.user.user.user.profileImage
                              : avator
                          }
                          alt='Profile Image'
                        />
                      </div>
                      <div className='profile-dropdown-info desktop-menu'>
                        <h5>{name ? name : localStorage.getItem('name')}</h5>
                        <p>{user.email}</p>
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
                      {/* <Link
                        className='dropdown-item py-2 dropdown-menu-hover'
                        to='/edit-portfolio'
                        onClick={() => setShowDropDown((preState) => !preState)}
                      >
                        MY PORTFOLIO
                      </Link> */}
                      {allowToShow ? (
                        <Link
                          className='dropdown-item py-2 dropdown-menu-hover'
                          to='#'
                          onClick={() => {
                            setCountStudentOfInstructor(true)
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
                      <Link
                        className='dropdown-item py-2 dropdown-menu-hover'
                        to='/logout'
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
              dispatch(changeSidebarState(!sideBarState))
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
                    showNotifications ? 'active' : ''
                  }`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    style={{
                      fontSize: '26px',
                      color: '#333D3D'
                    }}
                    className='nav-bell-icon pt-1'
                  />
                  {unreadNotifications > 0 && (
                    <span className='badge nofitication-badge'>
                      {unreadNotifications}
                    </span>
                  )}
                </a>
                {showNotifications && (
                  <Notifications
                    unreadNotifications={unreadNotifications}
                    notifications={notifications}
                    setShowNotifications={setShowNotifications}
                    setUnreadNotifications={setUnreadNotifications}
                  />
                )}
              </li>
              <div
                onClick={() => setShowNotifications(false)}
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
                      firstNote !== ''
                        ? `${`/my-notes/${firstNote}`}`
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
              {/* <img
                src={
                  profileImage && profileImage !== 'undefined'
                    ? profileImage
                    : localStorage.getItem('profileImage') !== 'null'
                    ? localStorage.getItem('profileImage')
                    : avator
                }
                alt='Profile Image'
              /> */}
              <img
                src={
                  mainState.user.user.user.profileImage
                    ? mainState.user.user.user.profileImage
                    : avator
                }
                alt='Profile Image'
              />
            </div>
            <div className='profile-dropdown-info desktop-menu'>
              <h5>{name}</h5>
              <p>{user.email}</p>
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
            {/* <Link
              className='dropdown-item py-2 dropdown-menu-hover'
              to='/MyStartupProfile'
              onClick={() => setShowDropDown((preState) => !preState)}
            >
              MY PROJECTS
            </Link> */}
            <Link
              className='dropdown-item py-2 dropdown-menu-hover'
              to='/my-connections'
              onClick={() => setShowDropDown((preState) => !preState)}
            >
              MY COMMUNITY
            </Link>
            <Link
              className='dropdown-item py-2 dropdown-menu-hover'
              to='#'
              onClick={showModal}
            >
              <IntlMessages id='navigation.contact_us' />
            </Link>
            <Link
              className='dropdown-item py-2 dropdown-menu-hover'
              to='#'
              onClick={showMisconductModal}
            >
              REPORT MISCONDUCT
            </Link>
            <Link
              className='dropdown-item py-2 dropdown-menu-hover'
              to='/logout'
            >
              <IntlMessages id='navigation.logout' />
            </Link>
          </div>
        </div>
      </nav>

      <ContactUsModal
        show={showContactModal}
        onHide={closeModal}
        user={currentUser}
      />

      <MisconductModal
        show={showMisconductReportModal}
        onHide={() => setShowMisconductReportModal(false)}
      />

      <TermAndCondition
        show={TnCModal}
        onHide={() => {
          user.TnC = true
          setOpenTnCModal(false)
          dispatch(updateTnC())
        }}
      />
      <StudentOfInstructors
        allow={() => allowToShow}
        onShow={countStudentOfInstructor}
        onHide={() => setCountStudentOfInstructor(false)}
      />
    </div>
  )
}
export default Header
