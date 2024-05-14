import React from 'react'
import { NavLink } from 'react-router-dom'
import SUSLogoStudent from '../../assets/images/LTS-logo-horizontal.png'
import ltsHSLogo from '../../assets/images/LTS-HS/LTS HS Logo v2-2.png'

const Header = (props) => {
  return (
    <div className="sidebar-header" onClick={() => props.hideHeaderIcons?.()}>
      <NavLink to="/dashboard">
        <img src={SUSLogoStudent} alt="logo" />
      </NavLink>
      <img src={ltsHSLogo} alt="logo" />
    </div>
  )
}

export default Header
