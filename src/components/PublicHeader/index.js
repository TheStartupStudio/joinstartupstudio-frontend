import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
// import Language from '../Language'
import IntlMessages from '../../utils/IntlMessages'
import SUSLogo from '../../assets/images/sus-institute-logo.png'
import SUSLogoStudent from '../../assets/images/LTS-logo-horizontal.png'
import HSLogounder from '../../assets/images/HS-Sidebar/Market-READY label.png'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'

function PublicHeader() {
  const showMenuMobile = window.location.href.includes('lts-secure')
  const location = useLocation()
  return (
    <div>
      {location.pathname !== '/ims-login' &&
        location.pathname !== '/' &&
        location.pathname !== '/signup-academy' &&
        location.pathname !== '/forgot-password' && (
          <nav
            className={`navbar navbar-expand-lg justify-content-between py-4 px-4 px-md-5 ${
              showMenuMobile && 'desktop-menu mt-lg-5'
            }  px-xl-2`}
            style={
              window.location.href.includes('lts-secure') ||
              window.location.href.includes('register')
                ? null
                : { background: 'transparent', paddingLeft: 0 }
            }
          >
            {/* <div className={`sidebar-header ${showMenuMobile && 'ms-md-5'}`}>
              <NavLink to='/'>
                {location.pathname !== '/' && (
                  <img src={SUSLogoStudent} alt='logo' className='ms-md-5' />
                )}
              </NavLink>
              <img src={HSLogounder} alt='logo' className='ms-md-5' />
              {location.pathname == '/ims-login' && (
                <div
                  style={{
                    textTransform: 'uppercase',
                    color: '#707070',
                    fontSize: 18
                  }}
                  className='ms-md-5'
                >
                  Instructor platform
                </div>
              )}
            </div> */}
            <ul
              className='navbar-nav navbar-expand-lg public-nav'
              style={{
                width: '100%'
              }}
            >
              {window.location.href.includes('terms') ||
              window.location.href.includes('lts-secure') ? (
                <li className='nav-item'>
                  {/* <a className='nav-link' href='/create-account'>
                <IntlMessages id='navigation.create_your_account' />
              </a> */}
                </li>
              ) : window.location.href.includes('register') ? (
                <li className='nav-item'>
                  <a className='nav-link mx-auto' href='/logout'>
                    <IntlMessages id='navigation.logout' />
                  </a>
                </li>
              ) : null}
              {window.location.href.includes('create-account') ||
              window.location.href.includes('lts-secure') ||
              window.location.href.includes('subscription-ended') ||
              window.location.href.includes('register') ||
              window.location.href.includes('reset-password') ||
              window.location.href.includes('forgot-password') ||
              window.location.href.includes('trial-ended') ? (
                <li
                  className='nav-item'
                  style={{
                    background: 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '0 !important'
                  }}
                >
                  <div
                    className={`sidebar-header ${showMenuMobile && 'ms-md-5'}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '0 !important'
                    }}
                  >
                    <NavLink to='/'>
                      {location.pathname !== '/' && (
                        <img
                          src={SUSLogoStudent}
                          alt='logo'
                          className='ms-md-5'
                        />
                      )}
                    </NavLink>
                    <img src={HSLogounder} alt='logo' className='ms-md-5' />
                  </div>
                  <a
                    className='nav-link'
                    href='/'
                    style={{
                      position: 'absolute',
                      // top: '90px',
                      right: '50px',
                      fontSize: '16px'
                    }}
                  >
                    <IntlMessages id='navigation.login' />
                  </a>
                </li>
              ) : null}
              {location.pathname === '/' && (
                <li className='nav-item'>
                  {/* <Link className='nav-link' to='/create-account'>
                <IntlMessages id='navigation.create_your_account' />
              </Link> */}
                </li>
              )}
              {/* <li className='nav-item mr-3'>
          <Language />
        </li> */}
            </ul>
          </nav>
        )}
      {showMenuMobile && (
        <nav className='mobile-menu'>
          <Navbar
            collapseOnSelect
            expand='lg'
            bg='light'
            variant='light'
            className='border-0'
          >
            <Navbar.Brand href='#home'>
              <img src={SUSLogo} alt='logo' style={{ width: '200px' }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse
              id='responsive-navbar-nav'
              className='border-bottom nav-item'
            >
              <Nav className='mr-auto d-inline text-end font-weight-bold public-nav'>
                <Nav.Link className='me-auto' href='/'>
                  LOGIN
                </Nav.Link>
                <Nav.Link className='me-auto' href='/create-account'>
                  CREATE YOUR ACCOUNT
                </Nav.Link>
                {/* <NavDropdown title='Dropdown' id='collasible-nav-dropdown'>
                <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
                <NavDropdown.Item href='#action/3.2'>
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href='#action/3.3'>
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href='#action/3.4'>
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </nav>
      )}
    </div>
  )
}

export default PublicHeader
