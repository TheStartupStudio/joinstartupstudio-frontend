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
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const role = localStorage.getItem('role')

  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)

  const location = useLocation()

  const navRef = useRef(null)
  const [navHeight, setNavHeight] = useState(0)

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

  console.log('ridon45', navHeight, location?.pathname)

  const getClass = () => {
    if (navHeight > 2100) {
      return 'h-99'
    } else {
      return 'h-95'
    }
  }

  const getNavClass = () => {
    if (navHeight > 2100) {
      return 'h-107'
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
    if (navHeight > 2100) {
      return 'h-101'
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
        width: isCollapsed ? '75px' : '220px',
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
            props={props}
            getOtherNavClass={getOtherNavClass}
          />
        </div>
      </div>
    </nav>
  )
}
export default Sidebar
