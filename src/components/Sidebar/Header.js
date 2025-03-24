import React from 'react'
import { NavLink } from 'react-router-dom'
import AcademyLogo from '../../assets/images/academy-icons/academy-logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { collapseTrue } from '../../redux/sidebar/Actions'

const Header = (props) => {
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)
  const dispatch = useDispatch()

  return (
    <div
      className='sidebar-header d-flex gap-1'
      style={{ justifyContent: isCollapsed && 'space-between' }}
      onClick={() => props.hideHeaderIcons?.()}
    >
      <NavLink to='/dashboard' onClick={() => dispatch(collapseTrue())}>
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
          <p className='powered white-space-no-wrap'>
            Powered by Learn to Start
          </p>
        </div>
      )}
    </div>
  )
}

export default Header
