import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import { setAccordionToggled } from '../../redux'
import IntlMessages from '../../utils/IntlMessages'
import SUSLogoStudent from '../../assets/images/LTS-logo-horizontal.png'
import $ from 'jquery'
import './index.css'
import logoImage from '../../assets/images/LearntoStart-Diagram-3D.png'
import FolderSidebarImage from '../../assets/images/HS-Sidebar-Icons/Dashboard (Full)-1200x.png'
import {Col,Row} from 'react-bootstrap'

const IconContainer = ({ srcImage }) => {
  return (
    <Col md="2" className="col-2 icon_container">
      <img src={srcImage} alt="Icon" className="w-100 h-100" />
    </Col>
  )
}

const SidebarItem = ({onClick,to,className,srcImage,title,isDropdown}) => {
  return (
    <a
      onClick={onClick ?? null}
      href={to}
      className={className}
  >
    <div
      className="d-flex w-100"
      style={{ alignItems: 'center' }}
    >
      <IconContainer srcImage={srcImage} />
      <div className="flex-grow-1 ms-1">
        <span className={'text-uppercase'}>
          {title}
        </span>
      </div>
      {isDropdown && (

      <FontAwesomeIcon
        icon={faAngleDown}
        className="me-2 me-md-0"
        style={{
          fontSize: '16px',
          color: '#333D3D'
        }}
      />
      )}
    </div>
    </a>
  )
}

function Sidebar(props) {
  const sideBarState = useSelector((state) => state.general.sidebarState)
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
                  fontSize: '14'
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
                <SidebarItem
                  onClick={() => {
                    dispatch(setAccordionToggled(false))
                    props.hideHeaderIcons()
                  }}
                  to={"/dashboard"}
                  className={`${
                    location.pathname.includes('dashboard') ? 'active' : ''
                  }`}
                srcImage={FolderSidebarImage}
                 title="MY Dashboard" 
                 isDropdown={false} />
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
                
                <SidebarItem srcImage={FolderSidebarImage} title="MY Learn to Start EDU" isDropdown={true} />
                
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
                  <NavLink
                    to={'/my-performance-data'}
                    activeClassName="sidenav active"
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase ">
                        My performance data
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
                  {/*      My performance data*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
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
                <SidebarItem srcImage={FolderSidebarImage} title="STUDENT JOURNALS" isDropdown={true} />
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
                <li>
                  <NavLink
                    to={'/student-wellnes'}
                    activeClassName="sidenav active"
                    disabled={true}
                  >
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                      <div className="ms-4 ps-2 py-1 text-uppercase">
                        WELLNESS JOURNAL
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    // disabled={true}
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
              </div>

              <li
                className="dropdownMenuSidebarHover"
                data-bs-toggle="collapse"
                href="#collapseClassroom"
                role="button"
                aria-expanded="true"
                aria-controls="collapseClassroom"
              >
                <SidebarItem srcImage={FolderSidebarImage} title="MY CLASSROOM" isDropdown={true} />
                
              </li>
              <div
                className="collapse"
                id="collapseClassroom"
                data-parent="#side-menu-main"
              >
                <li>
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
                <SidebarItem srcImage={FolderSidebarImage} title="MY MARKET RESOURCES" isDropdown={true} />
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
                </li>
              </div>
            </ul>
            <div className="sidebar-bottom">
              <div style={{ position: 'relative' }}>
                <img src={logoImage} alt="logoimage" />
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
