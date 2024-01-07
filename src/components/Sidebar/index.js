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
import SUSLogoStudent from '../../assets/images/LTS-logo-horizontal.png'
import sidebarImage from '../../assets/images/side-logo.png'
import diagramAnimation from '../../assets/json/lts-diagram.json'
import sidebarImageES from '../../assets/images/side-logo-es.png'
import $ from 'jquery'
import Lottie from 'react-lottie'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import logoImage from '../../assets/images/LearntoStart-Diagram-3D.png'
import materialCollectionsBookmark from '../../assets/icons/material-collections-bookmark.svg'
import mySparkBlack from '../../assets/icons/Asset 1.svg'

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

  // const ParentDropdownItem = (props) => {
  //   const hasChildren = props.children && props.children.length > 0
  //
  //   return (
  //     <li
  //       className="dropdownMenuSidebarHover"
  //       data-bs-toggle={hasChildren ? 'collapse' : ''}
  //       href={hasChildren ? '#' + props.href : ''}
  //       role="button"
  //       aria-expanded={hasChildren ? 'false' : 'true'}
  //       aria-controls={hasChildren ? props.href : ''}
  //     >
  //       <a>
  //         <div className="d-flex w-100" style={{ alignItems: 'center' }}>
  //           {props?.icon?.startsWith('/') && (
  //             <img src={props.icon} style={{ width: 20, marginRight: 10 }} />
  //           )}
  //           {!props?.icon?.startsWith('/') && (
  //             <FontAwesomeIcon
  //               className="sidebar-icon me-2"
  //               icon={props.icon}
  //             />
  //           )}
  //           <div className="ms-1 flex-grow-1">{props.title}</div>
  //           {hasChildren && (
  //             <FontAwesomeIcon
  //               icon={faAngleDown}
  //               className="me-2 me-md-0"
  //               style={{
  //                 fontSize: '16px',
  //                 color: '#333D3D',
  //               }}
  //             />
  //           )}
  //         </div>
  //       </a>
  //       {hasChildren && (
  //         <DropdownChildItems id={props.href}>
  //           {props.children}
  //         </DropdownChildItems>
  //       )}
  //     </li>
  //   )
  // }
  //
  // const DropdownChildItems = (props) => {
  //   return (
  //     <div className="collapse" id={props.id} data-parent="#side-menu-main">
  //       <ul className="nav">{props.children}</ul>
  //     </div>
  //   )
  // }
  //
  // const menuData = [
  //   {
  //     id: 'parent1',
  //     title: 'Parent 1',
  //     icon: materialCollectionsBookmark,
  //     children: [
  //       {
  //         id: 'child1',
  //         title: 'Child 1',
  //         path: '/child1',
  //       },
  //       {
  //         id: 'child2-parent',
  //         title: 'Child 2 Parent',
  //         icon: materialCollectionsBookmark,
  //         children: [
  //           {
  //             id: 'child2',
  //             title: 'Child 2',
  //             path: '/child2',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   // Add more menu items as needed
  // ]
  //
  // const renderMenuItems = (data) => {
  //   return data.map((item) => {
  //     if (item.children && item.children.length > 0) {
  //       return (
  //         <ParentDropdownItem
  //           key={item.id}
  //           title={item.title}
  //           icon={item.icon}
  //           href={item.id}
  //         >
  //           {renderMenuItems(item.children)}
  //         </ParentDropdownItem>
  //       )
  //     } else {
  //       return (
  //         <li key={item.id}>
  //           <NavLink
  //             onClick={() => {
  //               // dispatch(setAccordionToggled(false))
  //               // props.hideHeaderIcons()
  //             }}
  //             to={item.path}
  //             activeClassName="sidenav active"
  //           >
  //             <div className="d-flex" style={{ alignItems: 'center' }}>
  //               <div className="ms-4 ps-2 py-1">{item.title}</div>
  //             </div>
  //           </NavLink>
  //         </li>
  //       )
  //     }
  //   })
  // }

  const ParentDropdownItem = (props) => {
    return (
      <li
        className="dropdownMenuSidebarHover"
        data-bs-toggle="collapse"
        href={'#' + props.href}
        role="button"
        aria-expanded="true"
        aria-controls={props.ariaControls}
      >
        <a>
          <div className="d-flex w-100" style={{ alignItems: 'center' }}>
            {props?.icon?.startsWith('/') && (
              <img src={props.icon} style={{ width: 20, marginRight: 10 }} />
            )}
            {!props?.icon?.startsWith('/') && (
              <FontAwesomeIcon
                className="sidebar-icon me-2"
                icon={props.icon}
              />
            )}
            <div className="ms-1 flex-grow-1">
              {props.title}
              {/*<IntlMessages id="navigation.beyond_your_course" />*/}
            </div>
            <FontAwesomeIcon
              icon={faAngleDown}
              className="me-2 me-md-0"
              style={{
                fontSize: '16px',
                color: '#333D3D'
              }}
            />
          </div>
        </a>
      </li>
    )
  }

  const DropdownChildItems = (props) => {
    return (
      <div className="collapse" id={props.id} data-parent="#side-menu-main">
        {props.children}
      </div>
    )
  }

  const NavListItem = ({ onClick, to, activeClassName, text }) => (
    <li>
      <NavLink onClick={onClick} to={to} activeClassName={activeClassName}>
        <div className="d-flex" style={{ alignItems: 'center' }}>
          <div className="ms-4 ps-2 py-1">{text}</div>
        </div>
      </NavLink>
    </li>
  )

  return (
    <nav
      id="sidebar"
      className={`sidebar-area ${sideBarState ? ' sidenav active' : ''}`}
    >
      <div className="scroll sidebar-sticky sidebar-scroll">
        <PerfectScrollbar
          option={{ suppressScrollX: true, wheelPropagation: false }}
          className="sidebar-sticky"
        >
          <div>
            <div
              className="sidebar-header"
              onClick={() => props.hideHeaderIcons()}
            >
              <NavLink to="/dashboard">
                <img src={SUSLogoStudent} alt="logo" />
              </NavLink>
              <div
                style={{
                  textTransform: 'uppercase',
                  color: '#707070',
                  fontSize: 14
                }}
              >
                Instructor platform
              </div>
            </div>
            <ul
              className="list-unstyled components sidebar-menu-item"
              id="side-menu-main"
            >
              <li>
                <div
                  className="accordion accordion-flush"
                  id="accordionFlushExample"
                ></div>
                <NavLink
                  onClick={() => {
                    dispatch(setAccordionToggled(false))
                    props.hideHeaderIcons()
                  }}
                  to="/dashboard"
                  className={`${
                    location.pathname.includes('dashboard') ? 'active' : ''
                  }`}
                >
                  <div className="d-flex" style={{ alignItems: 'center' }}>
                    <div className="dashboard me-1"></div>
                    <div className="ms-2">
                      <IntlMessages id="navigation.dashboard" />
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
              {/*<RecursiveNavComponent data={data} />*/}
              <li
                className="dropdownMenuSidebarHover"
                data-bs-toggle="collapse"
                href="#myLtsEDU"
                role="button"
                aria-expanded="true"
                aria-controls="myLtsEDU"
              >
                <a>
                  <div
                    className="d-flex w-100"
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesomeIcon
                      className="sidebar-icon me-2"
                      icon={faFolder}
                    />
                    <div className="flex-grow-1 ms-1">
                      <span className={'text-uppercase'}>
                        MY Learn to Start EDU
                      </span>
                    </div>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className="me-2 me-md-0"
                      style={{
                        fontSize: '16px',
                        color: '#333D3D'
                      }}
                    />
                  </div>
                </a>
              </li>
              <div
                className="collapse"
                id="myLtsEDU"
                data-parent="#side-menu-main"
              >
                <li>
                  <NavLink to={'/my-training'} activeClassName="sidenav active">
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase">
                        My training
                      </div>
                    </div>
                  </NavLink>
                  {/*<div*/}
                  {/*  className="sidenav"*/}
                  {/*  style={{*/}
                  {/*    marginLeft: '24px !important',*/}
                  {/*    fontSize: 12,*/}
                  {/*    marginTop: 6,*/}
                  {/*    cursor: 'pointer'*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  <div className="d-flex" style={{ alignItems: 'center' }}>*/}
                  {/*    <div className="ms-4 ps-2 py-1 text-uppercase ">*/}
                  {/*      My training*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </li>
                <li>
                  <NavLink
                    to={'/my-curriculum'}
                    activeClassName="sidenav active"
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase">
                        My curriculum
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={'/my-certification-guide'}
                    activeClassName="sidenav active"
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase">
                        My certification guide
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  {/*<NavLink*/}
                  {/*  to={'/my-performance-data'}*/}
                  {/*  activeClassName="sidenav active"*/}
                  {/*>*/}
                  {/*  <div className="d-flex" style={{ alignItems: 'center' }}>*/}
                  {/*    <div className="ms-4 ps-2 py-1 text-uppercase ">*/}
                  {/*      My performance data*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</NavLink>*/}
                  <div
                    className="sidenav"
                    style={{
                      marginLeft: '24px !important',
                      fontSize: 12,
                      marginTop: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase ">
                        My performance data
                      </div>
                    </div>
                  </div>
                </li>
              </div>
              <li
                className="dropdownMenuSidebarHover"
                data-bs-toggle="collapse"
                href="#studentJournals"
                role="button"
                aria-expanded="true"
                aria-controls="studentJournals"
              >
                <a>
                  <div
                    className="d-flex w-100"
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesomeIcon
                      className="sidebar-icon me-2"
                      icon={faFolder}
                    />
                    <div className="flex-grow-1 ms-1">
                      <span className={'text-uppercase'}>STUDENT JOURNALS</span>
                    </div>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className="me-2 me-md-0"
                      style={{
                        fontSize: '16px',
                        color: '#333D3D'
                      }}
                    />
                  </div>
                </a>
              </li>
              <div
                className="collapse"
                id="studentJournals"
                data-parent="#side-menu-main"
              >
                <li>
                  <NavLink to={'/student-lts'} activeClassName="sidenav active">
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase">
                        LTS JOURNAL
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li className="disabledd">
                  <NavLink
                    to={'/student-wellnes'}
                    activeClassName="sidenav active"
                    disabled={true}
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase">
                        WELLNES JOURNAL
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    disabled={true}
                    to={'/student-personal-finance'}
                    activeClassName="sidenav active"
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase">
                        PERSONAL FINANCE JOURNAL
                      </div>
                    </div>
                  </NavLink>
                </li>
                {/* <li className="disabledd">
                  <NavLink
                    disabled={true}
                    to={'/student-leadership'}
                    activeClassName="sidenav active"
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase ">
                        LEADERSHIP JOURNAL
                      </div>
                    </div>
                  </NavLink>
                </li> */}
              </div>

              <li
                className="dropdownMenuSidebarHover"
                data-bs-toggle="collapse"
                href="#collapseClassroom"
                role="button"
                aria-expanded="true"
                aria-controls="collapseClassroom"
              >
                <a>
                  <div
                    className="d-flex w-100"
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesomeIcon
                      className="sidebar-icon me-2"
                      icon={faClipboardCheck}
                    />
                    <div className="flex-grow-1">
                      <span>MY CLASSROOM</span>
                    </div>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className="me-2 me-md-0"
                      style={{
                        fontSize: '16px',
                        color: '#333D3D'
                      }}
                    />
                  </div>
                </a>
              </li>
              <div
                className="collapse"
                id="collapseClassroom"
                data-parent="#side-menu-main"
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
                  <NavLink to={'/my-students'} activeClassName="sidenav active">
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1">MY STUDENTS</div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to="/iamr-inbox"
                    activeClassName="sidenav"
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1">MY IAMR INBOX</div>
                    </div>
                  </NavLink>
                </li>
                <li></li>
              </div>
              <li
                className="dropdownMenuSidebarHover"
                data-bs-toggle="collapse"
                href="#collapseExample"
                role="button"
                aria-expanded="true"
                aria-controls="collapseExample"
              >
                <a>
                  <div
                    className="d-flex w-100"
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesomeIcon
                      className="sidebar-icon me-2"
                      icon={faMapSigns}
                    />
                    <div className="ms-1 flex-grow-1">
                      <IntlMessages id="navigation.my_market_resources" />
                    </div>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className="me-2 me-md-0"
                      style={{
                        fontSize: '16px',
                        color: '#333D3D'
                      }}
                    />
                  </div>
                </a>
              </li>
              <div
                className="collapse"
                id="collapseExample"
                data-parent="#side-menu-main"
              >
                <li>
                  <NavLink
                    onClick={() => {
                      dispatch(setAccordionToggled(false))
                      props.hideHeaderIcons()
                    }}
                    to="/beyond-your-course"
                    activeClassName="sidenav active"
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1">
                        <IntlMessages id="beyond_your_course.master_classes_upper" />
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
                    to="/story-in-motion"
                    activeClassName="sidenav active"
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1">
                        <IntlMessages id="my_saved.STORY_IN_MOTION" />
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
            <div className="sidebar-bottom">
              <div style={{ position: 'relative' }}>
                <img src={logoImage} alt="logoimage" />
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
