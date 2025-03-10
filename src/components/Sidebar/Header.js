import React from 'react'
import { NavLink } from 'react-router-dom'
import AcademyLogo from '../../assets/images/academy-icons/academy-logo.png'

const Header = (props) => {
  const isCollapsed = props.isCollapsed
  return (
    <div
      className='sidebar-header d-flex gap-1'
      style={{ justifyContent: isCollapsed && 'space-between' }}
      onClick={() => props.hideHeaderIcons?.()}
    >
      <NavLink to='/dashboard'>
        <img
          src={AcademyLogo}
          alt='logo'
          style={{ marginLeft: isCollapsed && '0px' }}
        />
      </NavLink>
      {!isCollapsed && (
        <div>
          <h4 className='academy-header'>
            <span className='header-title'>THE</span>
            <br />
            STARTUP
            <br />
            STUDIO
          </h4>
          <p className='powered'>Powered by Learn to Start</p>
        </div>
      )}
    </div>
  )
}

export default Header
