import React, { useEffect, useState } from 'react'
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
  const [isCollapsed, setIsCollapsed] = useState(true)
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const role = localStorage.getItem('role')

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
      style={{
        width: isCollapsed ? '75px' : '220px',
        borderRadius: isCollapsed && '0px'
      }}
    >
      <div className='scroll sidebar-sticky sidebar-scroll h-95'>
        <div className='h-93'>
          <Header
            props={props}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          {/* {role === 'student' ? (
            <StudentSidebar props={props} />
          ) : (
            <InstructorSidebar props={props} />
          )} */}
          <InstructorSidebar
            props={props}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>
      </div>
    </nav>
  )
}
export default Sidebar
