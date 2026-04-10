import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import AcademyLogo from '../../assets/images/academy-icons/academy-logo.png'
import StudioOs from '../../assets/images/academy-icons/StudioOs.png'

import { useDispatch, useSelector } from 'react-redux'
import { collapseTrue, toggleCollapse } from '../../redux/sidebar/Actions'
import {
  fetchOrganizationBranding,
  loadOrganizationBrandingFromCache
} from '../../redux'
import { preloadImage } from '../../utils/preloadImage'
import CloseBtn from '../../assets/images/academy-icons/svg/icons8-close (1).svg'

const Header = (props) => {
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)
  const organizationLogo = useSelector(
    (state) => state.organizationBranding?.logo
  )
  const organizationBanner = useSelector(
    (state) => state.organizationBranding?.banner
  )
  const dispatch = useDispatch()
  const [showStudioOs, setShowStudioOs] = useState(false)
  const isDefaultLogo = !organizationLogo
  const user = useSelector((state) => state.user?.user?.user)
  const userRole = user?.role_id || parseInt(localStorage.getItem('role'))

  useEffect(() => {
    dispatch(loadOrganizationBrandingFromCache())
    const domain = window.location.hostname || ''
    if (domain) {
      dispatch(fetchOrganizationBranding(domain))
    }
  }, [dispatch])

  // Preload logo and banner as soon as we have URLs (from cache or API)
  useEffect(() => {
    if (organizationLogo) preloadImage(organizationLogo)
    if (organizationBanner) preloadImage(organizationBanner)
  }, [organizationLogo, organizationBanner])

  useEffect(() => {
    let timer

    if (!isCollapsed && isDefaultLogo) {
      timer = setTimeout(() => {
        setShowStudioOs(true)
      }, 250)
    } else {
      setShowStudioOs(false)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isCollapsed, isDefaultLogo])

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
          {isCollapsed ? (
            <img
              src={organizationLogo || AcademyLogo}
              alt='logo'
              style={{ marginLeft: isCollapsed && '0px' }}
            />
          ) : (
            <img
              src={organizationBanner || AcademyLogo}
              alt='banner'
              style={{ width: isDefaultLogo ? 'revert-layer' : '100%' }}
            />
          )}
          {/* <img
            src={organizationLogo || AcademyLogo}
            alt='logo'
            style={{ marginLeft: isCollapsed && '0px' }}
          /> */}

          {!isCollapsed && isDefaultLogo && showStudioOs && (
            <div>
              <h4
                className='academy-header'
                style={{ marginLeft: '.5rem', marginBottom: '-.75rem' }}
              >
                <img
                  style={{
                    width: '140px',
                    height: '100px',
                    objectFit: 'contain'
                  }}
                  src={StudioOs}
                  alt='StudioOS'
                />
              </h4>
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
