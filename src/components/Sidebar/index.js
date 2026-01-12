import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import $ from 'jquery'
import './index.css'
import Header from './Header'
import InstructorSidebar from './InstructorSidebar'
import StudentSidebar from './StudentSidebar'

function Sidebar(props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const role = localStorage.getItem('role')

  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)

  const location = useLocation()

  const navRef = useRef(null)
  const [navHeight, setNavHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight)
      }
    })

    // Observe the nav element for height changes
    if (navRef.current) {
      observer.observe(navRef.current)
    }

    return () => {
      if (navRef.current) {
        observer.unobserve(navRef.current)
      }
    }
  }, [])

  const getClass = () => {
    // On mobile, use full height to allow scrolling
    if (windowWidth <= 1135) {
      return 'h-100'
    }
    if (navHeight > 2100) {
      return 'h-99'
    } else {
      return 'h-95'
    }
  }

  const getNavClass = () => {
    // On mobile, don't constrain height to allow scrolling
    if (windowWidth <= 1135) {
      return ''
    }
    if (navHeight > 2100) {
      return ''
    } else if (navHeight > 830) {
      return 'h-98'
    } else if (navHeight > 1350) {
      return 'h-103'
    } else if (navHeight > 1480) {
      return 'h-105'
    } else {
      return 'h-93'
    }
  }

  const getOtherNavClass = () => {
    // On mobile, don't constrain height to allow scrolling
    if (windowWidth <= 1135) {
      return ''
    }
    if (navHeight > 2100) {
      return 'h-101'
    } else if (navHeight > 1960) {
      return 'h-100'
    } else if (navHeight > 1560) {
      return 'h-99'
    } else {
      return 'h-95'
    }
  }

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
      ref={navRef}
      id='sidebar'
      className={`sidebar-area ${sideBarState ? ' sidenav active' : ''}`}
      style={{
        // zIndex:'10000',
        width: isCollapsed
          ? windowWidth <= 1135
            ? '0px'
            : '75px'
          : windowWidth <= 1135
          ? '100%'
          : '220px',
        borderRadius: isCollapsed && '0px'
      }}
    >
      <div className={`scroll sidebar-sticky sidebar-scroll ${getClass()}`}>
        <div className={getNavClass()}>
          <Header props={props} />
          {/* {role === 'student' ? (
            <StudentSidebar props={props} />
          ) : (
            <InstructorSidebar props={props} />
          )} */}
          <InstructorSidebar
            navHeight={navHeight}
            props={props}
            getOtherNavClass={getOtherNavClass}
          />
        </div>
      </div>
    </nav>
  )
}
export default Sidebar
