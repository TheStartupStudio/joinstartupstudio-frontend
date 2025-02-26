import React from 'react'
import { NavLink } from 'react-router-dom'
import SUSLogoStudent from '../../assets/images/LTS Logo v2 (H-Light)x1200.png'
import AcademyLogo from '../../assets/images/academy-icons/academy-logo.png'
// import ltsHSLogo from '../../assets/images/LTS-HS/LTS HS Logo v2-2.png'
import ltsHSLogo from '../../assets/images/HS-Sidebar/Market-READY label.png'

const Header = (props) => {
  return (
    <div
      className='sidebar-header d-flex gap-1'
      onClick={() => props.hideHeaderIcons?.()}
    >
      <NavLink to='/dashboard'>
        <img src={AcademyLogo} alt='logo' />
      </NavLink>
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
    </div>
  )
}

export default Header
