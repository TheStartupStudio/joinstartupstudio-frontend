import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faIdCard,
  faTv,
  faMapSigns,
  faBookmark,
  faFolder,
  faCertificate,
  faClipboardCheck,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import { setAccordionToggled } from '../../redux'
import IntlMessages from '../../utils/IntlMessages'
import SUSLogoStudent from '../../assets/images/LTS-logo.png'
import sidebarImage from '../../assets/images/side-logo.png'
import diagramAnimation from '../../assets/json/lts-diagram.json'
import sidebarImageES from '../../assets/images/side-logo-es.png'
import $ from 'jquery'
import Lottie from 'react-lottie'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import logoImage from '../../assets/images/LearntoStart-Diagram-3D.png'

function Sidebar(props) {
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [animationPlaying, setAnimationPlaying] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    $(document).on('click', '.dropdownMenuSidebarHover', function () {
      $('.dropdownMenuSidebarHover').each(function () {
        const id = $(this).attr('href')

        if ($(id).hasClass('show') && $(id).find('.active').length < 1) {
          $(this)[0].click()
        }
      })
    })
  }, [])

  useEffect(() => {
    const path = location.pathname.split('/')[1]
    $('.dropdownMenuSidebarHover').each(function () {
      const id = $(this).attr('href')

      if ($(id).hasClass('show') && !$(id).html().includes(path)) {
        $(this)[0].click()
      }
    })
  }, [location])

  return (
    <nav
      id='sidebar'
      className={`sidebar-area ${sideBarState ? ' sidenav active' : ''}`}
    >
      <div className='scroll sidebar-sticky sidebar-scroll'>
        <PerfectScrollbar
          option={{ suppressScrollX: true, wheelPropagation: false }}
          className='sidebar-sticky'
        >
          <div>
            <div
              className='sidebar-header'
              onClick={() => props.hideHeaderIcons()}
            >
              <NavLink to='/dashboard'>
                <img src={SUSLogoStudent} alt='logo' />
              </NavLink>
            </div>
            <ul
              className='list-unstyled components sidebar-menu-item'
              id='side-menu-main'
            >
              <li>
                <div
                  className='accordion accordion-flush'
                  id='accordionFlushExample'
                ></div>
                <NavLink
                  onClick={() => {
                    dispatch(setAccordionToggled(false))
                    props.hideHeaderIcons()
                  }}
                  to='/dashboard'
                  className={`${
                    location.pathname.includes('dashboard') ? 'active' : ''
                  }`}
                >
                  <div className='d-flex' style={{ alignItems: 'center' }}>
                    <div className='dashboard me-1'></div>
                    <div className='ms-2'>
                      <IntlMessages id='navigation.dashboard' />
                    </div>
                  </div>
                </NavLink>
                {/* <a
                  href='/dashboard'
                  className={`mt-md-1 ${
                    location.pathname.includes('dashboard') ? 'active' : ''
                  }`}
                >
                  <div className='d-flex' style={{ alignItems: 'center' }}>
                    <div className='dashboard me-1'></div>
                    <div className='ms-2'>
                      <IntlMessages id='navigation.dashboard' />
                    </div>
                  </div>
                </a> */}
              </li>
              <li>
                <NavLink
                  onClick={() => {
                    dispatch(setAccordionToggled(false))
                    props.hideHeaderIcons()
                  }}
                  to='/startup-live'
                  className={`${
                    location.pathname.includes('startup-live') ? 'active' : ''
                  }`}
                >
                  <div className='d-flex' style={{ alignItems: 'center' }}>
                    <FontAwesomeIcon
                      className='sidebar-icon me-1'
                      icon={faTv}
                    />
                    <div className='ms-2'>
                      <IntlMessages id='navigation.startup_live' />
                    </div>
                  </div>
                </NavLink>
              </li>
              <li
                className='dropdownMenuSidebarHover'
                data-bs-toggle='collapse'
                href='#collapseTraining'
                role='button'
                aria-expanded='true'
                aria-controls='collapseTraining'
              >
                <a>
                  <div
                    className='d-flex w-100'
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesomeIcon
                      className='sidebar-icon me-2'
                      icon={faIdCard}
                    />
                    <div className='flex-grow-1 ms-1'>
                      <span>MY TRAINING</span>
                    </div>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className='me-2 me-md-0'
                      style={{
                        fontSize: '16px',
                        color: '#333D3D'
                      }}
                    />
                  </div>
                </a>
              </li>
              <div
                className='collapse'
                id='collapseTraining'
                data-parent='#side-menu-main'
              >
                <li>
                  <NavLink to={'/my-training'} activeClassName='sidenav active'>
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>INTRODUCTION TO LTS</div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={'/edit-portfolio'}
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>MY PORTFOLIO</div>
                    </div>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/resources'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>MY RESOURCES</div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={'/My-Market-Ready-Guide'}
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        MY MARKET-READY GUIDE
                      </div>
                    </div>
                  </NavLink>
                </li>
              </div>

              <li
                className='dropdownMenuSidebarHover'
                data-bs-toggle='collapse'
                href='#learn-to-start-collapse'
                role='button'
                aria-expanded='true'
                aria-controls='learn-to-start-collapse'
              >
                <a>
                  <div
                    className='d-flex w-100'
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesomeIcon
                      className='sidebar-icon me-2'
                      icon={faFolder}
                    />
                    <div className='ms-1 flex-grow-1'>
                      <span>MY CURRICULUM</span>
                    </div>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className='me-2 me-md-0'
                      style={{
                        fontSize: '16px',
                        color: '#333D3D'
                      }}
                    />
                  </div>
                </a>
              </li>
              <div
                className='collapse'
                id='learn-to-start-collapse'
                data-parent='#side-menu-main'
              >
                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/hs1-journal'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <span>LTS 1</span>
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/hs2-journal'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <span>LTS 2</span>
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/hs3-journal'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <span>LTS 3</span>
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/hs4-journal'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <span>LTS 4</span>
                      </div>
                    </div>
                  </NavLink>
                </li>
              </div>

              <li
                className='dropdownMenuSidebarHover'
                data-bs-toggle='collapse'
                href='#collapseClassroom'
                role='button'
                aria-expanded='true'
                aria-controls='collapseClassroom'
              >
                <a>
                  <div
                    className='d-flex w-100'
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesomeIcon
                      className='sidebar-icon me-2'
                      icon={faClipboardCheck}
                    />
                    <div className='flex-grow-1'>
                      <span>MY CLASSROOM</span>
                    </div>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className='me-2 me-md-0'
                      style={{
                        fontSize: '16px',
                        color: '#333D3D'
                      }}
                    />
                  </div>
                </a>
              </li>
              <div
                className='collapse'
                id='collapseClassroom'
                data-parent='#side-menu-main'
              >
                <li>
                  {/* <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/beyond-your-course'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <IntlMessages id='beyond_your_course.master_classes_upper' />
                      </div>
                    </div>
                  </NavLink> */}
                  <NavLink to={'/my-students'} activeClassName='sidenav active'>
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>MY STUDENTS</div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  {/* <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/#'
                    activeClassName='sidenav'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>IAMR(™) Assessments</div>
                    </div>
                  </NavLink> */}
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='#'
                    activeClassName='sidenav'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>MY IAMR INBOX</div>
                    </div>
                  </NavLink>
                </li>
                <li></li>
              </div>
              <li
                className='dropdownMenuSidebarHover'
                data-bs-toggle='collapse'
                href='#collapseExample'
                role='button'
                aria-expanded='true'
                aria-controls='collapseExample'
              >
                <a>
                  <div
                    className='d-flex w-100'
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesomeIcon
                      className='sidebar-icon me-2'
                      icon={faMapSigns}
                    />
                    <div className='ms-1 flex-grow-1'>
                      <IntlMessages id='navigation.beyond_your_course' />
                    </div>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className='me-2 me-md-0'
                      style={{
                        fontSize: '16px',
                        color: '#333D3D'
                      }}
                    />
                  </div>
                </a>
              </li>
              <div
                className='collapse'
                id='collapseExample'
                data-parent='#side-menu-main'
              >
                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/beyond-your-course'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <IntlMessages id='beyond_your_course.master_classes_upper' />
                      </div>
                    </div>
                  </NavLink>
                  {/* <a
                    href='/beyond-your-course'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <IntlMessages id='beyond_your_course.master_classes_upper' />
                      </div>
                    </div>
                  </a> */}
                </li>
                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to='/story-in-motion'
                    activeClassName='sidenav active'
                  >
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <IntlMessages id='my_saved.MEDIA_PODCASTS' />
                      </div>
                    </div>
                  </NavLink>
                  {/* <a href='/story-in-motion' activeClassName='sidenav active'>
                    <div className='d-flex' style={{ alignItems: 'center' }}>
                      <div className='ms-4 ps-2 py-1'>
                        <IntlMessages id='my_saved.MEDIA_PODCASTS' />
                      </div>
                    </div>
                  </a> */}
                </li>
              </div>
            </ul>
            <div className='sidebar-bottom'>
              <div style={{ position: 'relative' }}>
                <img src={logoImage} alt='logoimage' />
                {/* {!animationPlaying && (
                  <FontAwesomeIcon
                    icon={faPlay}
                    onClick={() => setAnimationPlaying(true)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '51%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: '2',
                      cursor: 'pointer',
                      fontSize: '26px',
                      color: '#da2d85'
                    }}
                  />
                )}
                <Lottie
                  options={{
                    animationData: diagramAnimation,
                    loop: false,
                    autoplay: false
                  }}
                  speed={0.75}
                  style={{
                    cursor: 'default',
                    marginLeft: '-20px',
                    width: 'calc(100% + 40px)'
                  }}
                  isClickToPauseDisabled={true}
                  isStopped={!animationPlaying}
                  eventListeners={[
                    {
                      eventName: 'complete',
                      callback: () => setAnimationPlaying(false)
                    }
                  ]}
                /> */}
              </div>
              {/* {currentLanguage === 'en' ? (
                <img src={sidebarImage} alt='sidebar' />
              ) : (
                <img src={sidebarImageES} alt='sidebar' />
              )} */}
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </nav>
  )
}
export default Sidebar
