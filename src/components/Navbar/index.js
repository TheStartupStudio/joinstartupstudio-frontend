import { faAngleLeft, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { changeSidebarState } from '../../redux'
import { getUserBasicInfo } from '../../redux/portfolio/Actions'
import { setBackButton } from '../../redux/backButtonReducer'
import NavbarListItems from './NavbarListItems'

const Navbar = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const userRole = localStorage.getItem('role')
  const { userBasicInfo } = useSelector((state) => state.portfolio.whoSection)

  const [showMobileDropDown, setShowMobileDropDown] = useState(false)
  const backButton = useSelector((state) => state.backButton)

  useEffect(() => {
    const urlSegments = window.location.pathname.split('/')

    if (
      urlSegments[1] === 'iamr' &&
      (urlSegments[2] === 'student-certification-1' ||
        urlSegments[2] === 'student-certification-2')
    ) {
      setBackButton({ state: true, location: 'iamr' })
    } else if (urlSegments[2] && urlSegments[2].includes('step')) {
      setBackButton({ state: true, location: 'my-immersion' })
    } else {
      setBackButton({ state: false, location: '' })
    }
  }, [])

  useEffect(() => {
    dispatch(getUserBasicInfo())
  }, [dispatch])

  const handleMobileNavBar = () => {
    if (showMobileDropDown === true) {
      setShowMobileDropDown(false)
    }
    dispatch(changeSidebarState(!props.sideBarState))
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light desktop-menu px-xl-2'>
      <div className='container-fluid'>
        <button
          type='button'
          id='sidebarCollapse'
          className='btn'
          style={{
            backgroundColor: '#01c5d1'
          }}
          onClick={() => {
            handleMobileNavBar()
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav  mt-1'>
            {backButton.state && (
              <div style={{ display: 'inherit' }}>
                <li className='nav-item my-auto'>
                  <button
                    className={`nav-link icon-menu px-2 me-2 my-auto `}
                    onClick={() => history.push('/' + backButton.location)}
                    style={{ border: 'none' }}
                  >
                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      style={{
                        fontSize: '26px'
                      }}
                      className='pt-1'
                    />
                  </button>
                </li>
              </div>
            )}
          </ul>
          <NavbarListItems
            {...props}
            userRole={userRole}
            userBasicInfo={userBasicInfo.data}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
