import React from 'react'
import { NavLink } from 'react-router-dom'
import AcademyLogo from '../../assets/images/academy-icons/academy-logo.png'

import { useDispatch, useSelector } from 'react-redux'
import { collapseTrue, toggleCollapse } from '../../redux/sidebar/Actions'
import CloseBtn from '../../assets/images/academy-icons/svg/icons8-close (1).svg'

const Header = (props) => {
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user?.user)
  const userRole = user?.role_id || parseInt(localStorage.getItem('role'))
  
  // ✅ Get appropriate dashboard path based on role
  const getDashboardPath = () => {
    // Role 2 = Client, Role 3 = Admin/Super Admin
    if (userRole === 2 || userRole === 3) {
      return '/admin-dashboard'
    }
    return '/dashboard'
  }

  return (
    <div
      className='sidebar-header d-flex justify-content-between gap-3'
      style={{ justifyContent: isCollapsed && 'space-between' }}
      onClick={() => props.hideHeaderIcons?.()}
    >
      <div className='d-flex gap-1'>
        <NavLink
          className='d-flex gap-1 align-items-center'
          to={getDashboardPath()}
          onClick={() => dispatch(collapseTrue())}
        >
          <img
            src={AcademyLogo}
            alt='logo'
            style={{ marginLeft: isCollapsed && '0px' }}
          />

          {!isCollapsed && (
            <div>
              <h4 className='academy-header' style={{ marginBottom: '.75rem' }}>
                <span className='header-title'>THE</span>
                <br />
                STARTUP
                <br />
                STUDIO
              </h4>
              <p
                className='powered white-space-no-wrap lh-1'
                style={{ fontSize: '.55rem' }}
              >
                Powered by Learn to Start
              </p>
            </div>
          )}
        </NavLink>
      </div>

      <img
        src={CloseBtn}
        alt='close-btn'
        className='menu-icon-cie self-start-tab cursor-pointer'
        onClick={() => dispatch(toggleCollapse())}
      />
    </div>
  )
}

export default Header
