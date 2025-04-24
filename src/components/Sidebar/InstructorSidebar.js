import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ExpandLogo from '../../assets/images/academy-icons/fast-arrow-right.png'
import LogOutIcon from '../../assets/images/academy-icons/svg/LogOut.svg'
import CoursEnIcon from '../../assets/images/academy-icons/svg/course-in-e.svg'
import DashIcon from '../../assets/images/academy-icons/svg/dashboard.svg'
import IntroToIcon from '../../assets/images/academy-icons/svg/intro-to-course.svg'
import LeadershipIcon from '../../assets/images/academy-icons/svg/leadership-journal.svg'
import MasterIcon from '../../assets/images/academy-icons/svg/master-classes.svg'
import PortfolioIcon from '../../assets/images/academy-icons/svg/my-portfolio.svg'
import SettingsIcon from '../../assets/images/academy-icons/svg/settings.svg'
import { setAccordionToggled, userLogout } from '../../redux'
import { setGeneralLoading } from '../../redux/general/Actions'
import { collapseTrue, toggleCollapse } from '../../redux/sidebar/Actions'
import SidebarItem from './SidebarItem'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'
import Tooltip from '../AcademyPortfolio/Tooltip'
import CancelRenewalModal from '../UserDetails/CancelRenewalModal'
import CancelSubModal from '../UserDetails/CancelSubModal'
import CertificateModal from '../UserDetails/CertificateModal'
import EditUserModal from '../UserDetails/EditUserModal'
import SubscriptionModal from '../UserDetails//SubscriptionModal'

const InstructorSidebar = (props) => {
  const [isTextVisible, setIsTextVisible] = useState(true)
  const dispatch = useDispatch()
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)
  const { user } = useSelector((state) => state.user.user)
  const [modal, setModal] = useState(false)
  const [subsbsciptionModal, setSubscriptionModal] = useState(false)
  const [cancelSubModal, setCancelSubModal] = useState(false)
  const [canceledRenewal, setCanceledRenewal] = useState(false)
  const [certificate, setCertificate] = useState(false)

  const toggle = () => setModal((prev) => !prev)

  const subToggle = () => {
    setModal((prev) => !prev)
    setCancelSubModal((prev) => !prev)
  }

  const toggleCancelModal = () => {
    setCancelSubModal((prev) => !prev)
    setModal((prev) => !prev)
  }

  const toggleCancelRenewal = () => {
    setCancelSubModal((prev) => !prev)
    setCanceledRenewal((prev) => !prev)
  }

  const toggleCertificate = () => {
    setCertificate((prev) => !prev)
  }

  const truncateEmail = (email) => {
    if (email.length > 15) {
      return email.slice(0, 15) + '...'
    }
    return email
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextVisible(!isCollapsed)
    }, 250)

    return () => clearTimeout(timer)
  }, [isCollapsed])

  const handleSidebarToggle = () => {
    dispatch(toggleCollapse())
  }

  const handleLogout = async () => {
    dispatch(setGeneralLoading(true))
    await dispatch(userLogout())
      .then(() => {
        localStorage.clear()
        // history.push('/')
        window.location.href = '/'
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => {
        window.location.href = '/'
        dispatch(setGeneralLoading(false))
      })
  }

  return (
    <div
      class={`d-flex flex-column justify-content-between ${props.getOtherNavClass()}`}
    >
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        id='side-menu-main'
      >
        {isCollapsed ? (
          <Tooltip text={'Dashboard'}>
            <SidebarItem
              onClick={() => {
                dispatch(setAccordionToggled(false))
                props.props.hideHeaderIcons()
              }}
              to={'/dashboard'}
              className={`${
                location.pathname.includes('dashboard') ? 'active' : ''
              }`}
              srcImage={DashIcon}
              title={isTextVisible && !isCollapsed && 'Dashboard'}
              isDropdown={false}
            />
          </Tooltip>
        ) : (
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/dashboard'}
            className={`${
              location.pathname.includes('dashboard') ? 'active' : ''
            }`}
            srcImage={DashIcon}
            title={isTextVisible && !isCollapsed && 'Dashboard'}
            isDropdown={false}
          />
        )}

        {isCollapsed ? (
          <Tooltip text={'Intro to Course'}>
            <SidebarItem
              onClick={() => {
                dispatch(setAccordionToggled(false))
                props.props.hideHeaderIcons()
              }}
              to={'/my-course-in-entrepreneurship'}
              className={`${
                location.pathname === '/my-course-in-entrepreneurship'
                  ? 'active'
                  : ''
              }`}
              srcImage={IntroToIcon}
              title={isTextVisible && !isCollapsed && 'Intro to course'}
              isDropdown={false}
            />
          </Tooltip>
        ) : (
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/my-course-in-entrepreneurship'}
            className={`${
              location.pathname === '/my-course-in-entrepreneurship'
                ? 'active'
                : ''
            }`}
            srcImage={IntroToIcon}
            title={isTextVisible && !isCollapsed && 'Intro to course'}
            isDropdown={false}
          />
        )}

        {isCollapsed ? (
          <Tooltip text={'Course In Entrepreneurship'}>
            <SidebarItem
              onClick={() => {
                dispatch(setAccordionToggled(false))
                props.props.hideHeaderIcons()
              }}
              to={'/my-course-in-entrepreneurship/journal/51'}
              className={`${
                location.pathname.includes(
                  'my-course-in-entrepreneurship/journal'
                )
                  ? 'active'
                  : ''
              }`}
              srcImage={CoursEnIcon}
              title={
                isTextVisible && !isCollapsed && 'Course in enterpreneurship'
              }
              isDropdown={false}
            />
          </Tooltip>
        ) : (
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/my-course-in-entrepreneurship/journal/51'}
            className={`${
              location.pathname.includes(
                'my-course-in-entrepreneurship/journal'
              )
                ? 'active'
                : ''
            }`}
            srcImage={CoursEnIcon}
            title={
              isTextVisible && !isCollapsed && 'Course in enterpreneurship'
            }
            isDropdown={false}
          />
        )}

        {isCollapsed ? (
          <Tooltip text={'Master Classes'}>
            <SidebarItem
              onClick={() => {
                dispatch(setAccordionToggled(false))
                props.props.hideHeaderIcons()
              }}
              to={'/beyond-your-course'}
              className={`${
                location.pathname.includes('beyond-your-course') ? 'active' : ''
              }`}
              srcImage={MasterIcon}
              title={isTextVisible && !isCollapsed && 'Master classes'}
              isDropdown={false}
            />
          </Tooltip>
        ) : (
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/beyond-your-course'}
            className={`${
              location.pathname.includes('beyond-your-course') ? 'active' : ''
            }`}
            srcImage={MasterIcon}
            title={isTextVisible && !isCollapsed && 'Master classes'}
            isDropdown={false}
          />
        )}

        {isCollapsed ? (
          <Tooltip text={'Leadership Journal'}>
            <SidebarItem
              onClick={() => {
                dispatch(setAccordionToggled(false))
                props.props.hideHeaderIcons()
              }}
              to={'/leadership-journal'}
              className={`${
                location.pathname.includes('leadership-journal') ? 'active' : ''
              }`}
              srcImage={LeadershipIcon}
              title={isTextVisible && !isCollapsed && 'Leadership journal'}
              isDropdown={false}
            />
          </Tooltip>
        ) : (
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/leadership-journal'}
            className={`${
              location.pathname.includes('leadership-journal') ? 'active' : ''
            }`}
            srcImage={LeadershipIcon}
            title={isTextVisible && !isCollapsed && 'Leadership journal'}
            isDropdown={false}
          />
        )}

        {isCollapsed ? (
          <Tooltip text={'My Portfolio'}>
            <SidebarItem
              onClick={() => {
                dispatch(setAccordionToggled(false))
                props.props.hideHeaderIcons()
              }}
              to={'/my-portfolio'}
              className={`${
                location.pathname.includes('my-portfolio') ? 'active' : ''
              }`}
              srcImage={PortfolioIcon}
              title={isTextVisible && !isCollapsed && 'My portfolio'}
              isDropdown={false}
            />
          </Tooltip>
        ) : (
          <SidebarItem
            onClick={() => {
              dispatch(setAccordionToggled(false))
              props.props.hideHeaderIcons()
            }}
            to={'/my-portfolio'}
            className={`${
              location.pathname.includes('my-portfolio') ? 'active' : ''
            }`}
            srcImage={PortfolioIcon}
            title={isTextVisible && !isCollapsed && 'My portfolio'}
            isDropdown={false}
          />
        )}
      </ul>
      <ul
        className='list-unstyled components sidebar-menu-item sidebar-menu-list'
        style={{ marginTop: '-20px' }}
      >
        <Tooltip text={`${isCollapsed ? 'Open Menu' : 'Close Menu'}`}>
          <li className='sub-li  d-none-tab'>
            <button className='sidebar-button' onClick={handleSidebarToggle}>
              <img
                className='rotated'
                src={ExpandLogo}
                alt='Expand'
                style={{
                  transform: isCollapsed && 'rotate(0deg)',
                  marginLeft: '4px'
                }}
              />
            </button>
          </li>
        </Tooltip>

        {isCollapsed ? (
          <Tooltip text={'My Account'}>
            <li
              className='sub-li'
              onClick={() => {
                dispatch(setAccordionToggled(false))
                dispatch(collapseTrue())
                props.props.hideHeaderIcons()
                toggle()
              }}
            >
              <div className='logout-button'>
                <div className='d-flex w-100' style={{ alignItems: 'center' }}>
                  <Col md='2' className='col-2 icon_container'>
                    <img
                      src={SettingsIcon}
                      alt='Icon'
                      style={{
                        width: '26px',
                        marginLeft: '3px',
                        objectFit: 'cover'
                      }}
                    />
                  </Col>
                  {isTextVisible && !isCollapsed && (
                    <div className='flex-grow-1 ms-1 mb-1'>MY ACCOUNT</div>
                  )}
                </div>
              </div>
            </li>
          </Tooltip>
        ) : (
          <li
            className='sub-li'
            onClick={() => {
              dispatch(setAccordionToggled(false))
              dispatch(collapseTrue())
              props.props.hideHeaderIcons()
              toggle()
            }}
          >
            <div className='logout-button'>
              <div className='d-flex w-100' style={{ alignItems: 'center' }}>
                <Col md='2' className='col-2 icon_container'>
                  <img
                    src={SettingsIcon}
                    alt='Icon'
                    style={{
                      width: '26px',
                      marginLeft: '3px',
                      objectFit: 'cover'
                    }}
                  />
                </Col>
                {isTextVisible && !isCollapsed && (
                  <div className='flex-grow-1 ms-1 mb-1'>MY ACCOUNT</div>
                )}
              </div>
            </div>
          </li>
        )}

        <li className='sub-li'>
          <Link to='dashboard'>
            <div className='d-flex w-100' style={{ alignItems: 'center' }}>
              <Col md='2' className='col-2 icon_container'>
                <img
                  className='profile-photo'
                  style={{ marginLeft: '-3.5px' }}
                  src={user.profileImage ? user.profileImage : blankProfile}
                  alt='Icon'
                />
              </Col>
              {isTextVisible && !isCollapsed && (
                <div className='flex-grow-1 ms-1 d-flex flex-column'>
                  <span className='font-profile'>{user?.name}</span>
                  <span className='font-profile email-profile'>
                    {truncateEmail(user?.email)}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </li>
        {isCollapsed ? (
          <Tooltip text={'Log Out'}>
            <li className='sub-li' onClick={handleLogout}>
              <div className='logout-button'>
                <div className='d-flex w-100' style={{ alignItems: 'center' }}>
                  <Col md='2' className='col-2 icon_container'>
                    <img
                      src={LogOutIcon}
                      alt='Icon'
                      style={{ width: '26px', marginLeft: '3px' }}
                    />
                  </Col>
                  {isTextVisible && !isCollapsed && (
                    <div className='flex-grow-1 ms-1 mb-1'>LOG OUT</div>
                  )}
                </div>
              </div>
            </li>
          </Tooltip>
        ) : (
          <li className='sub-li' onClick={handleLogout}>
            <div className='logout-button'>
              <div className='d-flex w-100' style={{ alignItems: 'center' }}>
                <Col md='2' className='col-2 icon_container'>
                  <img
                    src={LogOutIcon}
                    alt='Icon'
                    style={{ width: '26px', marginLeft: '3px' }}
                  />
                </Col>
                {isTextVisible && !isCollapsed && (
                  <div className='flex-grow-1 ms-1 mb-1'>LOG OUT</div>
                )}
              </div>
            </div>
          </li>
        )}
      </ul>
      <EditUserModal isOpen={modal} toggle={toggle} subToggle={subToggle} />

      {/* <SubscriptionModal
        subsbsciptionModal={subsbsciptionModal}
        setSubscriptionModal={setSubscriptionModal}
        toggleCancelModal={toggleCancelModal}
      /> */}

      <CancelSubModal
        cancelSubModal={cancelSubModal}
        setCancelSubModal={setCancelSubModal}
        toggleCancelModal={toggleCancelModal}
        toggleCancelRenewal={toggleCancelRenewal}
      />
      <CancelRenewalModal
        canceledRenewal={canceledRenewal}
        setCanceledRenewal={setCanceledRenewal}
      />

      <CertificateModal
        certificate={certificate}
        toggleCertificate={toggleCertificate}
        name={user.name}
      />
    </div>
  )
}

export default InstructorSidebar
