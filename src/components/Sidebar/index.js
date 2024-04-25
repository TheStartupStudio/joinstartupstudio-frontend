import React, { useEffect } from 'react'
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
import Footer from './Footer'
import Body from './Body'

function Sidebar(props) {
  const sideBarState = useSelector((state) => state.general.sidebarState)

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
      id="sidebar"
      className={`sidebar-area ${sideBarState ? ' sidenav active' : ''}`}
    >
      <div className="scroll sidebar-sticky sidebar-scroll">
        <PerfectScrollbar
          option={{ suppressScrollX: true, wheelPropagation: false }}
          className="sidebar-sticky"
        >
          <div>
            <Header props={props} />
            <Body props={props} />
            <Footer />
          </div>
        </PerfectScrollbar>
      </div>
    </nav>
  )
}
export default Sidebar
